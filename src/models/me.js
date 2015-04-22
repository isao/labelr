import Model from 'ampersand-model'
import Repos from './repos'
import githubMixin from '../helpers/github-api-mixin'

export default Model.extend(githubMixin, {
    url: 'https://api.github.com/user',

    initialize () {
        const token = window.localStorage.token

        if (token) {
            this.token = token
        }

        this.on('change:isLoggedIn', this.fetchAll)

        this.on('change:token', () => window.localStorage.token = this.token)
    },

    props: {
        login: 'string',
        token: 'string',
    },

    derived: {
        isLoggedIn: {
            deps: ['token'],
            fn () {
                return !!this.token
            }
        }
    },

    collections: {
        repos: Repos
    },

    fetchAll () {
        if (this.isLoggedIn) {
            this.fetch()
            this.repos.fetch()
        }
    }
})
