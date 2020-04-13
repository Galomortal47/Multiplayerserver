extends Node

var save = preload("res://scripts/save.gd").new()
var smooth = 0.1

func smoothing(var B, var A):
	return (A + ((B - A) * smooth))