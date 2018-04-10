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
}

ReactFormLifecycle.prototype.render = function render () {
  return this.props.render({
    form: this.state.form,
    errors: this.state.errors,
    lifecycle: {
      reset: arg => this.runLifecycle('reset', arg),
      edit: arg => this.runLifecycle('edit', arg),
      submit: arg => this.runLifecycle('submit', arg),
      error: arg => this.runLifecycle('error', arg),
      success: arg => this.runLifecycle('success', arg)
    }
  })
}
