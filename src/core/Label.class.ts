import State from './State.class';
import * as THREE from 'three';

export default class Label {
    constructor(state: State) {
        const raycaster = new THREE.Raycaster()
        const mouse = new THREE.Vector2()
        const { camera } = state.getState('document');
        const labels = state.getLabels()
        const scenes = labels.map(l => l.scene)
        let INTERSECTED = null

        window.addEventListener('click', () => {
            raycaster.setFromCamera(mouse, camera);

            const intersected = this.hasIntersectLabel(raycaster, scenes)

            if (intersected) {
                const label = labels.filter(l => l.scene.uuid === intersected[0].object.uuid)
                
                if (label.length > 0)
                    this.showInformativePanel(label[0].project)
            }
        })

        window.addEventListener('mousemove', (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);

            const intersected = this.hasIntersectLabel(raycaster, scenes)

            if (intersected) {
                INTERSECTED = intersected[0].object
                INTERSECTED.CURRENT_COLOR = intersected[0].object.material.color.getHex()
                INTERSECTED.material.color.set( 0xff0000 )
                window.document.getElementsByTagName('body')[0].style.cursor = 'pointer'
            } else {
                if (INTERSECTED) {
                    INTERSECTED.material.color.set(0xffffff)
                    window.document.getElementsByTagName('body')[0].style.cursor = 'auto'
                    INTERSECTED = null
                }
            }
        })

        this.bindCloseEvents()

        state.setState('loaders', { ...state.getState('loaders'), ...{has_handle_labels: true }})
    }

    hasIntersectLabel(raycaster, labels) {
        const intersects = raycaster.intersectObjects(labels);

        return intersects.length > 0 ? intersects : false
    }

    bindCloseEvents() {
        const projectContainer = window.document.getElementById('project-container')
        const closeProjectContainer = window.document.getElementById('close-project-container')
        
        if (projectContainer)
            projectContainer.addEventListener('click', (evt) => {
                if (evt.target && (evt.target as Element).id === 'project-container')
                    projectContainer.classList.add('hidden')
            })
        
        if (closeProjectContainer && projectContainer)
            closeProjectContainer.addEventListener('click', () => {
                projectContainer.classList.add('hidden')
            })
    }

    showInformativePanel(project) {
        const container = document.getElementById('project-container')
        const logoContainer = document.getElementById('logo-container')
        const projectTitle = document.getElementById('project-title')
        const projectDescription = document.getElementById('project-description')

        if (!container || !logoContainer || !projectTitle || !projectDescription) return

        container.classList.remove('hidden')
        logoContainer.src = project.picture
        projectTitle.textContent = project.name
        projectDescription.textContent = project.description
    }
}