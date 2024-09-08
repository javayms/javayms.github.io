/* global NexT, CONFIG, Velocity */

NexT.boot = {};

NexT.boot.registerEvents = function () {

  NexT.utils.registerScrollPercent();
  NexT.utils.registerCanIUseTag();

  // Mobile top menu bar.
  document.querySelector('.site-nav-toggle .toggle').addEventListener('click', () => {
    event.currentTarget.classList.toggle('toggle-close');
    var siteNav = document.querySelector('.site-nav');
    var animateAction = siteNav.classList.contains('site-nav-on') ? 'slideUp' : 'slideDown';

    if (typeof Velocity === 'function') {
      Velocity(siteNav, animateAction, {
        duration: 200,
        complete: function () {
          siteNav.classList.toggle('site-nav-on');
        }
      });
    } else {
      siteNav.classList.toggle('site-nav-on');
    }
  });

  var TAB_ANIMATE_DURATION = 200;
  document.querySelectorAll('.sidebar-nav li').forEach((element, index) => {
    element.addEventListener('click', event => {
      var item = event.currentTarget;
      var activeTabClassName = 'sidebar-nav-active';
      var activePanelClassName = 'sidebar-panel-active';
      if (item.classList.contains(activeTabClassName)) return;

      var targets = document.querySelectorAll('.sidebar-panel');
      var target = targets[index];
      var currentTarget = targets[1 - index];
      window.anime({
        targets: currentTarget,
        duration: TAB_ANIMATE_DURATION,
        easing: 'linear',
        opacity: 0,
        complete: () => {
          // Prevent adding TOC to Overview if Overview was selected when close & open sidebar.
          currentTarget.classList.remove(activePanelClassName);
          target.style.opacity = 0;
          target.classList.add(activePanelClassName);
          window.anime({
            targets: target,
            duration: TAB_ANIMATE_DURATION,
            easing: 'linear',
            opacity: 1
          });
        }
      });

      [...item.parentNode.children].forEach(element => {
        element.classList.remove(activeTabClassName);
      });
      item.classList.add(activeTabClassName);
    });
  });

  window.addEventListener('resize', NexT.utils.initSidebarDimension);

  window.addEventListener('hashchange', () => {
    var tHash = location.hash;
    if (tHash !== '' && !tHash.match(/%\S{2}/)) {
      var target = document.querySelector(`.tabs ul.nav-tabs li a[href="${tHash}"]`);
      target && target.click();
    }
  });
};

NexT.boot.refresh = function () {

  /**
   * Register JS handlers by condition option.
   * Need to add config option in Front-End at 'layout/_partials/head.swig' file.
   */
  CONFIG.fancybox && NexT.utils.wrapImageWithFancyBox();
  CONFIG.mediumzoom && window.mediumZoom('.post-body :not(a) > img, .post-body > img');
  CONFIG.lazyload && window.lozad('.post-body img').observe();
  CONFIG.pangu && window.pangu.spacingPage();

  CONFIG.exturl && NexT.utils.registerExtURL();
  CONFIG.copycode.enable && NexT.utils.registerCopyCode();
  NexT.utils.registerTabsTag();
  NexT.utils.registerActiveMenuItem();
  NexT.utils.registerLangSelect();
  NexT.utils.registerSidebarTOC();
  NexT.utils.wrapTableWithBox();
  NexT.utils.registerVideoIframe();
};

NexT.boot.motion = function () {
  // Define Motion Sequence & Bootstrap Motion.
  if (CONFIG.motion.enable) {
    NexT.motion.integrator
      .add(NexT.motion.middleWares.logo)
      .add(NexT.motion.middleWares.menu)
      .add(NexT.motion.middleWares.postList)
      .add(NexT.motion.middleWares.sidebar)
      .bootstrap();
  }
  NexT.utils.updateSidebarPosition();
};

document.addEventListener('DOMContentLoaded', () => {
  NexT.boot.registerEvents();
  NexT.boot.refresh();
  NexT.boot.motion();
});


function getMonsDay() {
  let nowTemp = new Date(); //当前时间
  let oneDayLong = 24 * 60 * 60 * 1000; //一天的毫秒数
  let c_time = nowTemp.getTime(); //当前时间的毫秒时间
  let c_day = nowTemp.getDay() || 7; //当前时间的星期几
  let m_time = c_time - (c_day - 1) * oneDayLong; //当前周一的毫秒时间
  let monday = new Date(m_time); //设置周一时间对象
  let m_year = monday.getFullYear();
  let m_month = monday.getMonth() + 1;
  let m_date = monday.getDate();
  let val = m_year + "-" + m_month + "-" + m_date;
  return m_year + '年' + m_month + '月';
}

let dateTextElement1 = document.getElementById("dateText");
if (dateTextElement1) {
  dateTextElement1.innerHTML = '更新: ' + getMonsDay();
}
let dateTextElement2 = document.getElementById("dateText2");
if (dateTextElement2) {
  dateTextElement2.innerHTML = '——' + getMonsDay();
}
let dateTextElement3 = document.getElementById("dateText3");
if (dateTextElement3) {
  dateTextElement3.innerHTML = getMonsDay();
}

function getIdFromUrl() {
  let url = window.location.href;
  //console.log("url=="+url)
  let matches = url.match(/\/(\d{2}\/\d{10})\d{3}[\da-zA-Z]{2}/);
  // console.log("matches=="+matches)
  // if(matches){
  //   console.log("matches[0]=="+matches[0])
  // }
  if (matches && matches[1]) {
    //console.log("matches[1]=="+matches[1])
    let idPart = matches[1].replace(/\//g, '');
    //console.log("idPart=="+idPart)
    return idPart;
  }
  //console.log("没匹配到")
  return null;
}

let idTextElement = document.getElementById("idText");
if (idTextElement) {
  let idFromUrl = getIdFromUrl();
  idTextElement.innerHTML = idFromUrl ? 'ID: ' + idFromUrl : '';
}


//2024-09-08 增加浏览器提示
function getBrowserWarningMessage() {
  const userAgent = navigator.userAgent;
  const currentUrl = window.location.href;
  let browser = "";
  if (userAgent.includes("MQQBrowser/")) {
    browser = "<strong><s>QQ</s></strong>";
  } else if (userAgent.includes("MicroMessenger/")) {
    browser = "<strong><s>微信</s></strong>";
  }
  return browser ? `建议用<strong>Edge/Chrome</strong>等浏览器打开本页 (勿在${browser}中直接打开),当前URL：${currentUrl}` : "";
}

const browserWarningTextElement = document.getElementById("browserWarningText");
if (browserWarningTextElement) {
  browserWarningTextElement.remove();
  // const warningMessage = getBrowserWarningMessage();
  // if (warningMessage) {
  //   browserWarningTextElement.innerHTML = warningMessage;
  // } else {
  //   browserWarningTextElement.remove();
  // }
}

