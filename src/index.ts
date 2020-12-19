import {NodePlopAPI} from 'plop'

export default (plop: NodePlopAPI) => {
    plop.setGenerator(`generate`, {
        description: 'Generates types for Cockpit',
        prompts: [
            {
                type: 'input',
                name: 'collection',
                message: 'Collection Name:',
            },
        ],
        actions: [
            (answers) => {
                console.log(answers)

                return 'TODO: implement'
            },
        ],
    })

}