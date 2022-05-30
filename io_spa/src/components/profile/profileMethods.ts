import {computed} from 'vue'
import {useProfileStore} from 'stores/users/profile';

export default function profileMethods() {
  // IMPORTS
  const profileStore = useProfileStore();

  // DATA


  // COMPUTED
  const profileData = computed(() => profileStore.getCurrentUser)


  // METHODS
  const fetchProfile = () => profileStore.fetchCurrentUser({});
  const logoutUser = () => profileStore.logoutUser({});

  return {
    profileData,
    fetchProfile,
    logoutUser,
  }
}
