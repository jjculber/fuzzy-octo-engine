function on_color_change(color) {
  frames[frame][0] = $(".led1 .led-input").spectrum("get").toHexString();
  frames[frame][1] = $(".led2 .led-input").spectrum("get").toHexString();
  frames[frame][2] = $(".led3 .led-input").spectrum("get").toHexString();
  frames[frame][3] = $(".led4 .led-input").spectrum("get").toHexString();
  frames[frame][4] = $(".led5 .led-input").spectrum("get").toHexString();
  frames[frame][5] = $(".led6 .led-input").spectrum("get").toHexString();
  frames[frame][6] = $(".led7 .led-input").spectrum("get").toHexString();
  frames[frame][7] = $(".led8 .led-input").spectrum("get").toHexString();
}

var frame = 0;
var repeat = false;
var timer;

var frames = [["#000000","#000000","#000000","#000000","#000000","#000000","#000000","#000000"]];
function play_animation() {
  $(".control-paused").show();
  $(".control-playing").hide();
  $(".led-input").spectrum("disable");
  timer = setInterval(animation_step_forward, beat_ms_delay());
}

function pause_animation() {
  $(".control-paused").hide();
  $(".control-playing").show();
  $(".led-input").spectrum("enable");
  clearInterval(timer);
}

function bpm() {
  return parseInt($("#bpm").val());
}

function beat_ms_delay() {
  return 60000.0 / bpm(); 
}

function update_slider() {
  var slider = $("#slider");
  slider.attr("max", frames.length - 1);
  slider.val(frame);
  $("#slider-value").text(frame + 1);
  $("#slider-total").text(frames.length);
}

function animation_render_frame() {
  update_slider();
  $(".led1 .led-input").spectrum("set", frames[frame][0]);
  $(".led2 .led-input").spectrum("set", frames[frame][1]);
  $(".led3 .led-input").spectrum("set", frames[frame][2]);
  $(".led4 .led-input").spectrum("set", frames[frame][3]);
  $(".led5 .led-input").spectrum("set", frames[frame][4]);
  $(".led6 .led-input").spectrum("set", frames[frame][5]);
  $(".led7 .led-input").spectrum("set", frames[frame][6]);
  $(".led8 .led-input").spectrum("set", frames[frame][7]);
}

function animation_step_forward() {
  frame += 1;
  if (frame === frames.length) {
    frame = (repeat ? 0 : frames.length - 1);
  }
  animation_render_frame();
}

function animation_step_backwards() {
  frame -= 1;
  if (frame < 0) {
    frame = (repeat ? frames.length - 1 : 0);
  }
  animation_render_frame();
}

function add_frame() {
  frames.splice(frame,0,frames[frame].slice(0));
  animation_step_forward();
}

function toggle_repeat() {
  repeat = !repeat;
}

function slider_change_handler() {
  frame = parseInt($("#slider").val());
  animation_render_frame();
}

function cToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0x0" + hex : "0x" + hex;
}

function colorToCode(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return "0x"+result[2]+",0x"+result[1]+",0x"+result[3]+",<br/>";
}

function delayToCode(delay_ms) {
  var delay_a = delay_ms & 0x0000ff;
  var delay_b = (delay_ms & 0x00ff00) >> 8;
  return (cToHex(delay_a)+","+cToHex(delay_b)+",<br/>");
}

function do_magic() {
  var textBox = $("#magic-box");
  var delay_ms = Math.round(beat_ms_delay());
  var text = "";
  for (beat = 0; beat < frames.length; beat++) {
    for (pixel = 0; pixel < frames[beat].length; pixel++) {
      text += colorToCode(frames[beat][pixel]);
    }
    text += delayToCode(delay_ms);
  }
  textBox.html(text);
}

$(function() {
  $(".led-input").spectrum({
      preferredFormat: "hex",
      showInput: true,
      showPalette: true,
      localStorageKey: "spectrum.history",
      change: on_color_change,
      palette: [
          ['red', 'green', 'blue']
      ]
  });
  update_slider();
  $("#slider").change(slider_change_handler);
  $(".control-plus").click(add_frame);
  $(".control-back").click(animation_step_backwards);
  $(".control-forward").click(animation_step_forward);
  $(".control-repeat").click(toggle_repeat);
  $(".control-play").click(play_animation);
  $(".control-pause").click(pause_animation);
  $(".control-magic").click(do_magic);
});

