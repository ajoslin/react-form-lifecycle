'use strict'

var FormLifecycle = require('form-lifecycle')
var React = require('react')
var PropTypes = require('prop-types')

function filterErrors (errors) {
  // Filter out falsy errors like {email: null} from the object.
  return Object.keys(errors || {}).reduce((acc, key) => {
    if (errors[key]) acc[key] = errors[key]
    return acc
  }, {})
}

ReactFormLifecycle.propTypes = {
  formDefaults: PropTypes.object,
  render: PropTypes.func.isRequired,
  getErrors: PropTypes.func
}
ReactFormLifecycle.defaultProps = {
  getErrors: function () { return {} }
}
module.exports = ReactFormLifecycle

ReactFormLifecycle.prototype = Object.create(React.Component.prototype)
function ReactFormLifecycle (props) {
  React.Component.call(this, props)
  this.state = {
    form: FormLifecycle.create(props.formDefaults)
  }
  this.state.errors = filterErrors(props.getErrors(this.state.form))
}

ReactFormLifecycle.prototype.runLifecycle = function runLifecycle (methodName, arg) {
  var newForm = FormLifecycle[methodName](this.state.form, arg)
  this.setState({
    form: newForm,
    errors: filterErrors(this.props.getErrors(newForm))
  })
  return newForm
}

ReactFormLifecycle.prototype.render = function render () {
  return this.props.render({
    form: this.state.form,
    errors: this.state.errors,
    lifecycle: {
      reset: function (arg) { return this.runLifecycle('reset', arg) },
      edit: function (arg) { return this.runLifecycle('edit', arg) },
      submit: function (arg) { return this.runLifecycle('submit', arg) },
      error: function (arg) { return this.runLifecycle('error', arg) },
      successs: function (arg) { return this.runLifecycle('successs', arg) }
    }
  })
}
