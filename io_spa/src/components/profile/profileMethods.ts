import {computed} from 'vue'
import { useProfileStore } from 'src/stores/users/profile';
import {UserInterface} from 'src/interfaces/user.interface';

export default function profileMethods() {
  // IMPORTS
  const profileStore = useProfileStore();

  // DATA


  // COMPUTED
  const profileData = computed(() => profileStore.getCurrentUser)


  // METHODS
  const fetchProfile = () => profileStore.fetchCurrentUser({});
  const logoutUser = () => profileStore.logoutUser({});
  const setProfileData = (data: UserInterface) => profileStore.setCurrentUser(data);

  return {
    profileData,
    fetchProfile,
    logoutUser,
    setProfileData
  }
}
