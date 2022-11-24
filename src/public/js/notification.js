
        function Noti({ content, status, animation = true, timer = 4000, progress = true, bgcolor, icon = 'show' }) {
            if (timer > 10000) {
                timer = 4000;
            }
            var status = status;
            var Noti_container = document.createElement('div');
            var Noti_alert = document.createElement('div');
            var timer_progress = document.createElement('div');
            Noti_container.setAttribute('id', 'Noti_container');
            document.body.appendChild(Noti_container);
            document.getElementById('Noti_container').appendChild(Noti_alert);
            timer_progress.setAttribute('class', 'timer_progress');
            if (progress != false) {
                document.querySelector('#Noti_container').appendChild(timer_progress);
            }
            if (animation == true) {
                Noti_alert.style = `
                -webkit-animation: 1s Noti_animation;
            animation: 1s Noti_animation;
            display: flex;
            flex-direction: row-reverse;
            align-items: center;
            justify-content: space-between;
            cursor: pointer;
            background: ${bgcolor}
            `;
            } else {
                Noti_alert.style = `
            display: flex;
            flex-direction: row-reverse;
            align-items: center;
            justify-content: space-between;
            cursor: pointer;
            background: ${bgcolor}
            `;
            }
            Noti_alert.addEventListener('click', function () {
                this.remove();
                timer_progress.remove();
            });
            const noti_destroy = function () {
                document.getElementById('Noti_container').removeChild(Noti_alert);
                timer_progress.remove();
            }
            var timeout = setTimeout(() => {
                noti_destroy();
            }, timer);
            Noti_alert.onmouseover = function () {
                clearTimeout(timeout);
                timer_progress.style.animationPlayState = 'paused';
                this.onmouseleave = function () {
                    setTimeout(noti_destroy, timer);
                    timer_progress.style.animationPlayState = 'running';
                }
            };
            switch (status) {
                case 'success':
                    Noti_alert.setAttribute('class', 'Noti_success');
                    icon == 'show' || icon == '' ?
                        Noti_alert.innerHTML = "<ion-icon name='checkmark-circle'></ion-icon>" + "<span>" + content + "</span>"
                        :
                        Noti_alert.innerHTML = content;
                    break;
                case 'warning':
                    Noti_alert.setAttribute('class', 'Noti_warning');
                    icon == 'show' || icon == '' ?
                        Noti_alert.innerHTML = "<ion-icon name='warning'></ion-icon>" + "<span>" + content + "</span>"
                        :
                        Noti_alert.innerHTML = content;
                    break;
                case 'danger':
                    Noti_alert.setAttribute('class', 'Noti_danger');
                    icon == 'show' || icon == '' ?
                        Noti_alert.innerHTML = "<ion-icon name='close-circle'></ion-icon>" + "<span>" + content + "</span>"
                        :
                        Noti_alert.innerHTML = content;
                    break;
                default:
                    Noti_alert.setAttribute('class', 'Noti_success');
                    Noti_alert.innerHTML = "<ion-icon name='checkmark-circle'></ion-icon>" + "<span>" + content + "</span>";
                    break;
            }
            var new_timer_mode = '';
            switch (timer) {
                case 1000:
                    new_timer_mode = '1s';
                    break;
                case 2000:
                    new_timer_mode = '2s';
                    break;
                case 3000:
                    new_timer_mode = '3s';
                    break;
                case 4000:
                    new_timer_mode = '4s';
                    break;
                case 5000:
                    new_timer_mode = '5s';
                    break;
                case 6000:
                    new_timer_mode = '6s';
                    break;
                case 7000:
                    new_timer_mode = '7s';
                    break;
                case 8000:
                    new_timer_mode = '8s';
                    break;
                case 9000:
                    new_timer_mode = '9s';
                    break;
                case 10000:
                    new_timer_mode = '10s';
                    break;
                default:
                    new_timer_mode = '4s';
            }
            timer_progress.style.animation = `${new_timer_mode} timer_progress_animation`;
            timer_progress.style.webkitAnimation = `${new_timer_mode} timer_progress_animation`;
        }
        function success() {
            Noti({
                status: 'success',
                content: 'Success message',
                timer: 5000,
                animation: true,
                progress: true,
            });
        }
        function warning() {
            Noti({
                status: 'warning',
                content: 'Warning message',
                timer: 5000,
                animation: true,
                progress: true
            });
        }
        function danger() {
            Noti({
                status: 'danger',
                content: 'Error message',
                timer: 5000,
                animation: true,
                progress: true
            });
        }

        // custom background
        function custombg1() {
            Noti({
                status: 'success',
                content: 'Success message',
                timer: 4000,
                animation: true,
                progress: true,
                bgcolor: '#4f70ff',
                icon: 'show'
            });
        }
        function custombg2() {
            Noti({
                status: 'danger',
                content: 'Success message',
                timer: 4000,
                animation: true,
                progress: true,
                bgcolor: '#ff66b3',
                icon: 'show'
            });
        }
        function custombg3() {
            Noti({
                status: 'success',
                content: 'Success message',
                timer: 74000,
                animation: true,
                progress: true,
                bgcolor: 'linear-gradient(60deg,#3866ff,#38c0ff)',
                icon: 'show'
            });
        }
        function custombg4() {
            Noti({
                status: 'danger',
                content: 'danger message',
                timer: 7000,
                animation: true,
                progress: true,
                bgcolor: 'linear-gradient(60deg,#ff2c2c,#ff9564)',
                icon: 'show'
            });
        }
        function custombg5() {
            Noti({
                status: 'success',
                content: 'Thành Công',
                timer: 4000,
                animation: true,
                progress: true,
                bgcolor: 'linear-gradient(60deg,#00ad34,#0ee4c7)',
                icon: 'show'
            });
        }