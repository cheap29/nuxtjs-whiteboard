import Api from './index'

export default {
  testPosting () {
    const item = { user: 'Success!' }
    return Api().post('/', item)
  }
}