const getters = {
	sizeHeader:state => state.settings.sizeHeader,
	baseImgUrl: state => state.settings.baseImgUrl,
	uploadApi: state => state.settings.uploadApi,
	uploadsApi: state => state.settings.uploadsApi,
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name
}
export default getters
