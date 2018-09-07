'use strict'

var FormLifecycle = require('form-lifecycle')
var React = require('react')
var PropTypes = require('prop-types')

ReactFormLifecycle.propTypes = {
  formDefaults: PropTypes.object,
  onChange: PropTypes.func,
  onReset: PropTypes.func,
  onEdit: PropTypes.func,
  onSubmit: PropTypes.func,
  onError: PropTypes.func,
  onSucces: PropTypes.func,
  render: PropTypes.func
}

module.exports = ReactFormLifecycle

ReactFormLifecycle.prototype = Object.create(React.Component.prototype)
function ReactFormLifecycle (props) {
  React.Component.call(this, props)
  this.state = {
    form: FormLifecycle.create(props.formDefaults)
  }
}

ReactFormLifecycle.prototype.runLifecycle = function runLifecycle (
  methodName,
  arg
) {
  var newForm = FormLifecycle[methodName](this.state.form, arg)

  if (this.props.onChange) {
    this.props.onChange(newForm, this.state.form)
  }

  const fn = this.props['on' + methodName[0].toUpperCase() + methodName.slice(1)]
  if (fn) {
    fn(newForm, this.state.form)
  }

  this.setState({
    form: newForm
  })

  return newForm
}

ReactFormLifecycle.prototype.render = function render () {
  var self = this
  var render = this.props.render || [].concat(this.props.children)[0]

  return render({
    form: this.state.form,
    errors: this.state.errors,
    lifecycle: {
      reset: function (arg) {
        return self.runLifecycle('reset', arg)
      },
      edit: function (arg) {
        return self.runLifecycle('edit', arg)
      },
      submit: function (arg) {
        return self.runLifecycle('submit', arg)
      },
      error: function (arg) {
        return self.runLifecycle('error', arg)
      },
      success: function (arg) {
        return self.runLifecycle('success', arg)
      }
    }
  })
}
