const hook = require("../../core/hook");

hook.addHook('admin-menu', (menus) => {
    menus[2].subs.push({
        title: 'Messenger',
        icon: 'metismenu-icon pe-7s-diamond',
        link: '/admin/messenger'
    })
})

hook.addHook('frontend-js', () => {
    return `<!-- Load Facebook SDK for JavaScript -->
                <div id="fb-root"></div>
                <script>
                window.fbAsyncInit = function() {
                    FB.init({
                    xfbml            : true,
                    version          : 'v9.0'
                    });
                };

                (function(d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) return;
                js = d.createElement(s); js.id = id;
                js.src = 'https://connect.facebook.net/vi_VN/sdk/xfbml.customerchat.js';
                fjs.parentNode.insertBefore(js, fjs);
                }(document, 'script', 'facebook-jssdk'));</script>

                <!-- Your Chat Plugin code -->
                <div class="fb-customerchat"
                attribution=setup_tool
                page_id="816123265162866"
            theme_color="#fa3c4c"
            logged_in_greeting="Xin chào! Tôi có thể giúp gì cho bạn?"
            logged_out_greeting="Xin chào! Tôi có thể giúp gì cho bạn?">
                </div>`
})