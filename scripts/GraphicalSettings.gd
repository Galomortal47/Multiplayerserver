extends CanvasLayer

var view

func _ready():
	view = get_viewport()
	view.set_hdr(true)
	pass # Replace with function body.
func _on_MSAA_value_changed(value):
	view.set_msaa(value)
	pass # Replace with function body.

func _on_MSAA2_value_changed(value):
	print(ProjectSettings.get_setting('rendering/quality/directional_shadow/size'))
	ProjectSettings.set_setting('rendering/quality/directional_shadow/size',value)
	pass # Replace with function body.