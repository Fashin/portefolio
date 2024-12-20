export function render(_url) {
    const html = `
        <div id="project-container" class="hidden absolute top-0 bottom-0 left-0 right-0 bg-slate-950/50 h-screen flex rounded border-white border-2 justify-center items-center overflow-scroll">
			<div class="flex flex-col">
				<div id="header" class="flex justify-end">
					<img id="close-project-action" src="/icons/cross.svg" class="h-4 w-4 cursor-pointer mt-2 mr-2" alt="">
				</div>
				<div class="flex justify-center justify-center items-center min-w-96 p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4" id="project-list">
					
				</div>
			</div>
		</div>
		<div id="loader-container">
			<div id="loader-icon"></div>
		</div>
    `

    return { html }
}