let listHook = {}

// listHook = {
//     admin-menu: [ callback ]
// }

module.exports = {
    addHook: (name, callback) => {
        if (!(name in listHook)) listHook[name] = []
        listHook[name].push(callback)
    },
    doHook: (name, ...params) => {
        if (name in listHook) {
            let result = ''
            for (let i in listHook[name]) {

                result += listHook[name][i](...params)


            }
            return result;
        }
    }
}