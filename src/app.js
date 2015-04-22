import app from 'ampersand-app'
import icons from 'octicons/octicons/octicons.css'
import styles from './styles/main.styl'
import Router from './router'
import Me from './models/me'

app.extend ({
    init() {
        this.me = new Me
        this.me.fetchAll()
    	this.router = new Router
    	this.router.history.start()
    }
})

app.init()

window.app = app