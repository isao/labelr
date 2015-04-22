import Router from 'ampersand-router'
import React from 'react'
import qs from 'qs'
import xhr from 'xhr'
import app from 'ampersand-app'

import Layout from './layout'
import PublicPage from './pages/public'
import ReposPage from './pages/repos'
import RepoDetail from './pages/repo'
import MessagePage from './pages/message'

const auth = function (name) {
    return function () {
        if (app.me.isLoggedIn) {
            this[name].apply(this, arguments);
        } else {
            this.redirectTo('/');
        }
    }
}

export default Router.extend({
    routes: {
        '': 'public',
        'repos': auth('repos'),
        'repos/:name/:repoName': auth('repoDetail', 'super-user'),
        'login': 'login',
        'logout': 'logout',
        'auth/callback?code=:code': 'authCallback',
        '*404': 'fourOhfour',
    },

    renderPage (Page, opts = {}) {
        const Main = (
            <Layout me={app.me}>
                <Page {...opts} />
            </Layout>
        )

        React.render(Main, document.body);
    },

    public () {
        React.render(<PublicPage/>, document.body)
    },

    repos () {
        this.renderPage(ReposPage, {repos: app.me.repos})
    },

    repoDetail (name, repoName) {
        const repo = app.me.repos.getByFullName(name + '/' + repoName)
        this.renderPage(RepoDetail, {repo, labels: repo.labels})
    },

    login () {
        window.location = 'https://github.com/login/oauth/authorize?' + qs.stringify({
            scope: 'user,repo',
            redirect_uri: window.location.origin + '/auth/callback',
            client_id: 'f8dd69187841cdd22a26',
        })
    },

    logout () {
        window.localStorage.clear()
        window.location = '/'
    },

    fourOhfour () {
        this.renderPage(MessagePage, {title: '404', body: 'nothing to see here'})
    },

    authCallback (code) {
        xhr({
            url: 'https://labelr-dev.herokuapp.com/authenticate/' + code,
            json: true,
        }, (err, resp, body) => {
            if (err) {
                this.renderPage(MessagePage, {title: 'sorry!', body: 'did not work'})
            }
            app.me.token = body.token
            this.redirectTo('/repos')
        });

        this.renderPage(MessagePage, {title: 'Logging into GitHub'})
    }
})
