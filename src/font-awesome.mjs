import { layer, icon, counter } from '@fortawesome/fontawesome-svg-core'
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons'

const graduationCapIcon = icon(faGraduationCap)
const tutorialLogo = document.getElementById('tutorial-icons')
tutorialLogo.innerHTML = graduationCapIcon.html[0]