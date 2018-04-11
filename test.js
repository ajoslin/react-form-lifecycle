// var h = require('react-hyperscript')
// var React = require('react')
// var FormLifecycle = require('./')
// var {render, Simulate, wait} = require('react-testing-library')
var test = require('tape')

// function runApiCall (shouldSucceed) {
//   return new Promise((resolve, reject) => {
//     if (shouldSucceed) resolve('success')
//     else reject (new Error('hello'))
//   })
// }

// function createRender () {
//   return h(FormLifecycle, {
//     formDefaults: {
//       fields: { hello: 'true' }
//     },
//     render: ({ form, lifecycle, errors }) => {
//       return h('form', {
//         onSubmit: e => {
//           e.preventDefault()
//           if (Object.keys(errors).length) {
//             return lifecycle.error()
//           }
//           lifecycle.submit()
//         }
//       }, [
//         form.error && h('div', {
//           'data-testid': 'form-error'
//         }, form.error)
//       ])
//     }
//   })
// }

test('whats up', t => {
  t.end()
})
