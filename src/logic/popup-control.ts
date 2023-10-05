import {ref} from "vue";

export const popupIsActivated = ref(false);

export const closePopup = () => {
    popupIsActivated.value = false;
}

export function togglePopup() {
    if (popupIsActivated.value === false) {
        popupIsActivated.value = true;
    } else {
        popupIsActivated.value = false;
    }
}