import { layer, icon, counter } from '@fortawesome/fontawesome-svg-core'
import { faGraduationCap, faBullhorn,  } from '@fortawesome/free-solid-svg-icons'

export const graduationCapIcon = icon(faGraduationCap)
export const bullhornIcon = icon(faBullhorn)
const tutorialLogo = document.getElementById('tutorial-icons')
tutorialLogo.innerHTML = graduationCapIcon.html[0]