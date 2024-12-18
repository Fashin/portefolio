import { projects } from '../config/projects';
import State from './State.class';
import * as THREE from 'three';

export default class Dialogue {
    constructor(state: State) {
        const raycaster = new THREE.Raycaster()
        const mouse = new THREE.Vector2()
        const { camera } = state.getState('document');
        const models = state.getClickableModels()
        const scenes = models.map(m => m.scene)
        let INTERSECTED = null

        window.addEventListener('click', () => {
            raycaster.setFromCamera(mouse, camera);

            const intersected = this.hasIntersectLabel(raycaster, scenes)

            if (intersected)
                this.showInformativePanel()
        })

        window.addEventListener('mousemove', (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);

            const intersected = this.hasIntersectLabel(raycaster, scenes)

            if (intersected) {
                INTERSECTED = intersected[0].object
                window.document.getElementsByTagName('body')[0].style.cursor = 'pointer'
            }
            else if (INTERSECTED) {
                window.document.getElementsByTagName('body')[0].style.cursor = 'auto'
                INTERSECTED = null
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
        const container = window.document.getElementById('project-container')
        const closeProjectAction = window.document.getElementById('close-project-action')

        if (!container || !closeProjectAction) return

        closeProjectAction.addEventListener('click', () => {
            container.style.display = 'none'
        })
    }

    showInformativePanel() {
        const container = document.getElementById('project-container')
        const list = document.getElementById('project-list')
        
        if (!container || !list) return

        console.log(list.children.length)
        
        if (list.children.length === 0) {
            for (let i in projects) {
                const data = projects[i]
                const div = document.createElement('div')
                div.classList.add('project-list-index')
                div.setAttribute('redirect', data.website.url)
                const dom = `
                    <div class="flex flex-col rounded hover:bg-slate-500/50 cursor-pointer mx-4 min-h-96 h-96">
                        <div class="flex justify-center items-center mt-2 h-48 px-8">
                            <img src="/logo/${data.picture}" class="${data.picture_custom_size ?? 'w-full'} h-full object-contain" alt="">
                        </div>
                        <div class="flex flex-col text-white justify-center items-center p-4">
                            <h3 class="text-2xl font-bold mt-2">${data.title}</h3>
                            <p class="mt-2 text-center">${data.description}</p>
                            <a class="underline underline-offset-4 mt-2" href="https://${data.website.url}">${data.website.text}</a>
                        </div>
                    </div>
                `
                div.innerHTML = dom
                list.appendChild(div)
            }
    
            const elements = document.getElementsByClassName('project-list-index')
    
            for (let i in elements)
                if (elements[i] instanceof HTMLElement)
                    elements[i].addEventListener('click', (evt) => {
                        window.open('https://' + elements[i].getAttribute('redirect'), '_blank')
                    })
        }
        
        container.style.display = 'block'
    }
}