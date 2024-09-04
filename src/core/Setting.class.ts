export default class Setting {
    constructor(window: Window) {
        const setting = window.document.getElementById('setting')
        const menuItems = window.document.getElementsByClassName('menu-item')
        const settingItems = window.document.getElementsByClassName('setting-item')

        if (menuItems.length >= 2) {
            menuItems[0].addEventListener('click', this.handleClickOnSetting)
            menuItems[1].addEventListener('click', this.handleLogout)
        }
        
        if (setting)
            setting.addEventListener('click', this.handleSettingToggle)

        if (settingItems && settingItems.length == 4)
            for (let i in settingItems)
                if (typeof settingItems[i] == 'object')
                    settingItems[i].addEventListener('click', this.handleSettingChange)

        window.addEventListener('keydown', this.handleKeyDown)
    }

    public handleKeyDown(evt: KeyboardEvent) {
        if (!(evt.code == 'Escape')) return

        const el = window.document.getElementById('setting')

        if (!el) return

        el.style.display = (el.style.display == 'flex') ? 'none' : 'flex'
    }

    private handleSettingToggle(evt: any) {
        if (evt.target.id != 'setting')
            return

        const el = window.document.getElementById('setting')

        if (!el) return

        el.style.display = 'none'
    }

    private handleClickOnSetting() {
        const containers = window.document.getElementsByClassName('container')

        if (!containers || containers.length != 2)
            return

        containers[0].style.display = 'none'
        containers[1].style.display = 'flex'
    }

    private handleSettingChange() {
        
    }

    // TODO
    private handleLogout() {

    }
}