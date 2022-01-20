import store from '../store'
import { selectAllCharacters } from '../store/selectors'

export const getUserCharacters = () => selectAllCharacters(store.getState())
