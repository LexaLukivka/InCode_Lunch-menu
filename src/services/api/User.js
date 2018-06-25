/* eslint-disable class-methods-use-this,no-underscore-dangle */
import JWT from 'jwt-decode'
import Http from '../Http'
import Token from '../Token'
import Cache from '../Cache'

class User {
  async register(credentials) {
    const { token, refreshToken } = await Http.post('/signUp', credentials)
    Token.remember(token, refreshToken)

    const user = JWT(token)._doc
    this.save(user)

    return user
  }

  async login(credentials) {
    if (!Cache.has('user') || !Cache.has('token')) {
      const { token, refreshToken } = await Http.post('/signIn', credentials)
      Token.remember(token, refreshToken)

      const user = JWT(token)._doc
      this.save(user)
    }
    return this.getSaved()
  }

  async verifyEmailPost(credentials) {
    const { token, refreshToken } = await Http.post('/verifyEmail', credentials)
    Token.remember(token, refreshToken)
    const user = JWT(token)._doc
    this.save(user)

    return this.getSaved()
  }

  async verifyEmailGet() {
    if (!Cache.has('user') || !Cache.has('token')) {
      const url = await Http.get('/verifyEmail')
      console.log(url.url)
    }
  }

  async changeBalance({ email, value }) {
    if (!Cache.has('user') || !Cache.has('token')) {
      const { token, refreshToken } = await Http.put('/balance', { email, value })
      Token.remember(token, refreshToken)

      const user = JWT(token)._doc

      if (Cache.get('user').email === user.email) {
        this.save(user)
      }
    }
    return this.getSaved()
  }

  getSaved() {
    return Cache.get('user')
  }

  save(user) {
    Cache.put('user', user)
  }

  logout() {
    Cache.remove('user')
    Token.clear()
  }
}

export default new User()
