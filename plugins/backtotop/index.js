const hook = require("../../core/hook");

hook.addHook('frontend-js', () => {
    return `<button style="    width: 50px;
    height: 50px;
    position: fixed;
    bottom: 20px;
    right: 10px;
    border: none;
    background: blue;
    border-radius: 100%;
    color: white;
    outline: none;
    font-size: 30px;
    align-items: center;
    justify-content: center" id="movetop" onclick="topFunction()" title="Go to top"><span class="fa fa-angle-up"></span></button>`
})