var diagnosite = {
	tweenMax: null,
	currentState: 'state1',
	elements: function() { //获取页面元素
		this.$pages = $('.pages');
	},
	events: function() { //事件的集合
		var _this = this,
			time = null,
			btn = true;
		$(window).resize(function() { //改变浏览器大小时执行的函数
			_this.resize();
		});

		$(window).on('scroll', _this.scrollFn);

		$(window).on('scroll', function() {
			var time = _this.tweenMax.totalDuration() * _this.scrollScale(),
				prevState = _this.tweenMax.getLabelBefore(time),
				nextState = _this.tweenMax.getLabelAfter(time),
				prevTime = _this.tweenMax.getLabelTime(prevState),
				nextTime = _this.tweenMax.getLabelTime(nextState);

			if(Math.abs(nextTime - time) <= 0.1) {
				_this.tweenMax.seek(nextTime, false);
			} else {
				_this.tweenMax.seek(time, false);
			}
		});

		$(window).on({
			'mousedown': function() {
				$(this).off('scroll', _this.scrollFn)
			},
			'mouseup': function() {
				var totalTime = _this.tweenMax.totalDuration(),
					time = totalTime * _this.scrollScale(),
					prevState = _this.tweenMax.getLabelBefore(time),
					nextState = _this.tweenMax.getLabelAfter(time),
					prevTime = _this.tweenMax.getLabelTime(prevState),
					nextTime = _this.tweenMax.getLabelTime(nextState),
					prevDvalue = Math.abs(prevTime - time),
					nextDvalue = Math.abs(nextTime - time);
				if(_this.scrollScale() == 0) {
					_this.currentState = 'state1'
				} else
				if(_this.scrollScale() == 1) {
					_this.currentState = 'footer'
				} else if(prevDvalue < nextDvalue) {
					_this.currentState = prevState
				} else {
					_this.currentState = nextState
				}
				//				_this.tweenMax.tweenTo(_this.currentState);

				var curTime = _this.tweenMax.getLabelTime(_this.currentState),
					s = curTime / totalTime * ($('body').height() - $(window).height()),
					t = Math.abs(time - curTime),
					scrollTween = new TimelineMax();

				scrollTween.to('html,body', t, {
					'scrollTop': s
				})

			}
		})

		this.navAnimate();

		$('html,body').on('mousewheel', function(ev) {
			ev.preventDefault();
		});

		this.animate3D($('.nav-right'));
		this.animate3D($('.button1'));
		this.animate3D($('.button2'));
	},
	init: function() { //动画初始化
		this.elements();
		this.events();
		this.twoAnimate();
		this.threeAnimate();
		this.fiveAnimate();
		this.initAnimate();
		this.resize();

	},
	resize: function() { //改变页面宽度高度
		var curHeight = $(window).height();
		this.$pages.height(curHeight).slice(1).css('top', curHeight);
		this.scrollAnimate();
	},
	scrollFn: function() {
		$(window).scrollTop(0);
	},
	navAnimate: function() { //导航上的动画
		var navTween = new TimelineMax();
		$('.nav-link li').on({
			'mouseenter': function() {
				var l = $(this).find('a').position().left,
					navL = $('.nav-link').position().left,
					w = $(this).find('a').width();
				navTween.clear();
				navTween.to('.nav-wrap .line', 0.3, {
					opacity: 1,
					left: l + navL,
					width: w,
					ease: Back.easeOut
				})
			},
			'mouseleave': function() {
				navTween.clear();
				navTween.to('.nav-wrap .line', 0.3, {
					opacity: 0
				})
			}
		});

		$('.nav-lang').on({
			'mouseenter': function() {
				$(this).find('.lang-slide').fadeIn('fast');
			},
			'mouseleave': function() {
				$(this).find('.lang-slide').fadeOut('fast');
			}
		});
	},
	initAnimate: function() { //初始动画
		var initTween = new TimelineMax(),
			_this = this;

		initTween.to('.nav', 0.5, {
				'opacity': 1,
				'left': 0
			})
			.to('.nav-link', 0.5, {
				'opacity': 1
			})
			.to('.nav-lang', 0.5, {
				'opacity': 1
			})
			.to('.nav-right', 0.5, {
				'opacity': 1
			})
			.to('.scene-logo', 0.5, {
				'opacity': 1
			})
			.staggerTo('.page1-text img', 2, {
				'opacity': 1,
				'rotationX': 0,
				ease: Elastic.easeOut
			}, 0.3)
			.to('.light_left', 0.7, {
				rotationZ: 0,
				ease: Power3.easeOut
			}, '-=2')
			.to('.light_right', 0.7, {
				rotationZ: 0,
				ease: Power3.easeOut
			}, '-=2')
			.to('.controls', 0.5, {
				bottom: 20,
				opacity: 1,
				ease: Power3.easeOut,
				onComplete: function() {
					_this.pageScroll(_this)
				}
			}, '-=0.7');

	},
	scrollAnimate: function() { //每屏滚动动画
		var _this = this;
		if(this.tweenMax) {
			this.currentState = this.tweenMax.currentLabel()
			this.tweenMax.clear();
		}
		this.tweenMax = new TimelineMax();
		this.tweenMax.to('.nav-wrap', 0, {
				'top': 22
			})
			.to('.footer', 0, {
				'top': '100%'
			})
			.add('state1')
			.to('.page2', 0.8, {
				'top': 0,
				ease: Power3.easeInOut,
				onComplete: function() {
					_this.animateMenu('nav2');
					_this.twoTween.tweenTo('twoState1');
				},
				onReverseComplete: function() {
					_this.animateMenu('nav1');
					_this.twoTween.seek(0, false)
				}
			})
			.add('state2')
			.to({}, 0.1, {
				onComplete: function() {
					_this.twoTween.tweenTo('twoState2');
				},
				onReverseComplete: function() {
					_this.twoTween.tweenTo('twoState1');
				}
			})
			.add('twoPoint1')
			.to({}, 0.1, {
				onComplete: function() {
					_this.twoTween.tweenTo('twoState3');
				},
				onReverseComplete: function() {
					_this.twoTween.tweenTo('twoState2');
				}
			})
			.add('twoPoint2')
			.to({}, 0.1, {
				onComplete: function() {
					_this.twoTween.tweenTo('twoState4');
				},
				onReverseComplete: function() {
					_this.twoTween.tweenTo('twoState3');
				}
			})
			.add('twoPoint3')
			.to('.page3', 0.8, {
				'top': 0,
				ease: Power3.easeInOut,
				onComplete: function() {
					_this.animateMenu('nav3');
					_this.threeTween.tweenTo('threeState1')
				},
				onReverseComplete: function() {
					_this.animateMenu('nav2');
					_this.threeTween.seek(0, false)
				}
			})
			.add('state3')
			.to({}, 0.1, {
				onComplete: function() {
					_this.threeTween.tweenTo('threeState2')
				},
				onReverseComplete: function() {
					_this.threeTween.tweenTo('threeState1')
				}
			})
			.add('threePoint1')
			.to('.page4', 0.8, {
				'top': 0,
				ease: Power3.easeInOut
			})
			.add('state4')
			.to('.page4', 0.8, {
				'top': -($(window).height()),
				ease: Power3.easeInOut
			})
			.to('.nav-wrap', 0.8, {
				'top': -110,
				ease: Power3.easeInOut
			}, '-=0.8')
			.to('.page5', 0.8, {
				'top': 0,
				ease: Power3.easeInOut,
				onComplete: function() {
					_this.fiveTween.tweenTo('fiveState')
				},
				onReverseComplete: function() {
					_this.fiveTween.seek(0, false)
				}
			}, '-=0.8')
			.add('state5')
			.to('.page5', 0.8, {
				'top': -$('.footer').height(),
				ease: Power3.easeInOut
			})
			.to('.footer', 0.8, {
				'top': $(window).height() - $('.footer').height(),
				ease: Power3.easeInOut
			}, '-=0.8')
			.add('footer')
			.stop();
		this.tweenMax.seek(_this.currentState);
		//		console.log(_this.currentState);
	},
	pageScroll: function(_this) { //上下滚屏
		var state = "",
			btn = true;

		$('body').css({
			'overflow-y': 'scroll',
			'height': '8500px'
		});

		//根据屏幕滚动时间控制滚动条
		$('body,html').on('mousewheel', function(ev, delta) {
			$(window).off('scroll', _this.scrollFn)
			if(btn) {
				btn = false;
				var time = _this.tweenMax.getLabelTime(_this.currentState); //获取当前状态时间点
				if(delta > 0) {
					state = _this.tweenMax.getLabelBefore(time);
				} else {
					state = _this.tweenMax.getLabelAfter(time);
				};

				if(state) {
					var totalTime = _this.tweenMax.totalDuration(), //动画的总时间
						nextTime = _this.tweenMax.getLabelTime(state), //运动到下个状态所需要的总时间
						scrollHeight = $('body').height() - $(window).height(), //滚动条滚动的最大距离
						h = nextTime / totalTime * scrollHeight,
						scrollTween = new TimelineMax(),
						disTime = Math.abs(nextTime - _this.tweenMax.time()); //上个状态到下个状态运动的时间
					//					_this.tweenMax.tweenTo(state);
					scrollTween.to('body,html', disTime, {
						'scrollTop': h
					});
					_this.currentState = state;
					//					console.log(state);
				}
				setTimeout(function() {
					btn = true
				}, 1000)
			}
		})
	},
	scrollScale: function() { //滚动条当前高度比例
		var totalScroll = $('body').height() - $(window).height(),
			currentScroll = $(window).scrollTop(),
			scrollScale = currentScroll / totalScroll;
		return scrollScale
	},
	twoAnimate: function() { //第二屏中小动画
		this.twoTween = new TimelineMax();
		this.twoTween.staggerTo('.page2 .step1 img', 1.2, {
				opacity: 1,
				rotationX: 0,
				ease: Elastic.easeOut
			}, 0.1)
			.to('.points', 0.2, {
				bottom: 20
			}, '-=1')
			.to('.points li:eq(0) .text', 0.1, {
				opacity: 1
			}, '-=1')
			.to('.points li:eq(0) .point-icon', 0.1, {
				'background-position': 'right top'
			}, '-=1')
			.add('twoState1')
			.to('.page2 .step1 img', 0.3, {
				opacity: 0,
				rotationX: -90
			})
			.staggerTo('.page2 .step2 img', 0.3, {
				opacity: 1,
				rotationX: 0,
				ease: Power3.easeInOutOut
			}, 0)
			.to('.points li .text', 0, {
				opacity: 0
			}, '-=0.3')
			.to('.points li .point-icon', 0, {
				'background-position': 'left top'
			})
			.to('.points li:eq(1) .text', 0.1, {
				opacity: 1
			})
			.to('.points li:eq(1) .point-icon', 0, {
				'background-position': 'right top'
			})
			.add('twoState2')
			.to('.page2 .step2 img', 0.3, {
				opacity: 0,
				rotationX: -90
			})
			.staggerTo('.page2 .step3 img', 0.3, {
				opacity: 1,
				rotationX: 0,
				ease: Power3.easeInOutOut
			}, 0)
			.to('.points li .text', 0, {
				opacity: 0
			}, '-=0.3')
			.to('.points li .point-icon', 0, {
				'background-position': 'left top'
			})
			.to('.points li:eq(2) .text', 0.1, {
				opacity: 1
			})
			.to('.points li:eq(2) .point-icon', 0, {
				'background-position': 'right top'
			})
			.add('twoState3')
			.to('.page2 .step3 img', 0.3, {
				opacity: 0,
				rotationX: -90
			})
			.staggerTo('.page2 .step4 img', 0.3, {
				opacity: 1,
				rotationX: 0,
				ease: Power3.easeInOutOut
			}, 0)
			.to('.points li .text', 0, {
				opacity: 0
			}, '-=0.3')
			.to('.points li .point-icon', 0, {
				'background-position': 'left top'
			})
			.to('.points li:eq(3) .text', 0.1, {
				opacity: 1
			})
			.to('.points li:eq(3) .point-icon', 0.1, {
				'background-position': 'right top'
			})
			.add('twoState4')
			.stop();
	},
	threeAnimate: function() { //第三屏中小动画
		this.threeTween = new TimelineMax();
		this.threeTween.staggerTo('.page3 .step1 img', 1.2, {
				opacity: 1,
				rotationX: 0,
				ease: Elastic.easeOut
			}, 0.1)
			.add('threeState1')
			.to('.page3 .step1 img', 0.3, {
				opacity: 0,
				rotationX: -90
			})
			.staggerTo('.page3 .step2 img', 0.3, {
				opacity: 1,
				rotationX: 0,
				ease: Power3.easeInOut
			}, 0)
			.add('threeState2')
			.stop()
	},
	fiveAnimate: function() {
		this.fiveTween = new TimelineMax();
		this.fiveTween.to('.page5-img', 0.5, {
				top: 0,
				ease: Power3.easeOut
			})
			.staggerTo('.page5-text img,.page5-text .button1,.page5-text .buttons', 1.2, {
				opacity: 1,
				rotationX: 0,
				ease: Elastic.easeOut
			}, 0.2)
			.to('.page5 .lines', 0.5, {
				opacity: 1
			}, '-=0.5')
			.add('fiveState')
			.stop()
	},
	animate3D: function(obj) {
		var animate3D = null,
			h = obj.find('.state1').height();
		obj.on({
			'mouseenter': function() {
				animate3D = new TimelineMax()
				animate3D.to($(this).find('.state1'), 0.3, {
						rotationX: 90,
						transformOrigin: "center bottom",
						y: -h
					}, 0)
					.to($(this).find('.state2'), 0.3, {
						rotationX: 0,
						y: -h
					}, 0)
			},
			'mouseleave': function() {
				animate3D.reverse()
			}
		});
	},
	animateMenu: function(obj) {
		var nav = $('.nav-content'),
			newNav = nav.clone(true),
			h = nav.height(),
			navTween = new TimelineMax();
		newNav.removeClass('nav1 nav2 nav3').addClass(obj);
		$('.nav').append(newNav);
		navTween.to(nav, 0, {
				top: 0,
				rotationX: 0,
				transformPerspective: 600,
				transformOrigin: "center bottom",
				y: 0
			})
			.to(newNav, 0, {
				top: h,
				rotationX: -90,
				transformPerspective: 600,
				transformOrigin: 'center top',
				y: 0
			})
			.to(nav, 0.3, {
				rotationX: 90,
				y: -h
			})
			.to(newNav, 0.3, {
				rotationX: 0,
				y: -h,
				onComplete: function() {
					nav.remove()
				}
			}, "-=0.3")
	}
}

$(function() {
	diagnosite.init();
})