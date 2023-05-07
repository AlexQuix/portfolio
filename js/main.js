import ScrollTrigger from "./scrollTrigger.js";
import AutoScroll from "./AutoScroll.js";
import ScrollSpy from "./ScollSpy.js";
import { calPercentage, getTranslateValuesFromMatrix } from "./utils.js";

const hero = document.querySelector(".hero-wrapper");
const boat = document.querySelector(".boat");
const crab = document.querySelector(".crab .crab-icon")
const boatTrack = document.querySelector(".boat-track");
const boatSceneElement = document.querySelector(".boat-scene");
const routeWake = document.querySelector(".route-wake-wrapper");
const scrollInfo = document.querySelector(".scroll-info");
const heroRect = hero.getBoundingClientRect();
const btnAutoScroll = document.querySelector(".auto-scroll .btn-auto-scroll");

function main(){
    let boatSceneRect = boatSceneElement.getBoundingClientRect();
    let boatRect = boat.getBoundingClientRect();
    let posy = heroRect.height;
    
    let height = boatSceneRect.height - heroRect.height - boatRect.height;

    boat.style.left = "-30px";
    boat.style.top = posy + "px";
    boatTrack.style.top = posy + "px";
    boatTrack.style.height = height.toFixed(0) + "px";

    scrollInfo.style.top = innerHeight/2 +"px";

    // BOAT ANIMATION
    handleBoatScene();

    // SKILL SCENE
    handleSkillScene();

    // PROJECT SCENE
    handleProjectScene();

    // BEACH SCENE
    handleBeachScene();

    // AUTO SCROLL
    handleAutoScroll();

    // SCROLL SPY
    new ScrollSpy(".nav-link");
}

function handleProjectScene(){
    let liquidIndicator = document.querySelector(".project .liquid");
    let carousel = document.querySelector(".project #carousel-project");
    let liquidStyle = window.getComputedStyle(liquidIndicator);
    let width = +liquidStyle.getPropertyValue("--width");
    let space = +liquidStyle.getPropertyValue("--space");
    let border = +liquidStyle.getPropertyValue("--border")*2;
    let currentX = 0;

    
    function liquidTimeline(animations = []){
        let tl = anime.timeline({
            targets: liquidIndicator,
            easing: "easeInQuad",
            duration: 400,
            autoplay: false
        });

        animations.forEach((v)=>{
            tl.add(v);
        });

        return tl;
    }

    carousel.addEventListener("slide.bs.carousel", ({from, to})=>{
        let move = Math.abs(from - to);
        let nextWidth = ((width + space - border) * move) + width;
        let animations = [];

        if(to > from){
            currentX += ((width + space - border) * move);

            animations.push({
                width: [width, nextWidth]
            });
            animations.push({
                width: [nextWidth, width],
                translateX: [currentX]
            });

            return liquidTimeline(animations).play();
        }
        
        currentX -= ((width + space - border) * move);

        animations.push({
            width: [width, nextWidth],
            translateX: [currentX],
        });
        animations.push({
            width: [nextWidth, width],
        });

        liquidTimeline(animations).play();
    });
}

function handleSkillScene(){
    let uniqueAnimation = true;
    let stagger = anime({
        targets: ".skill .skill-card",
        scale: [ 0.4, 1 ],
        opacity: [ 0, 1 ],
        duration: 300,
        easing: 'easeOutSine',
        delay: anime.stagger(200, { from: 4 }),
        autoplay: false
    })

    new ScrollTrigger({
        startTrigger: ".skill",
        endTrigger: ".skill",
        pointerTop: innerHeight / 2,
        onStart(){
            if(uniqueAnimation){
                uniqueAnimation = false;

                setTimeout(()=>{
                    stagger.play();
                }, 300)
            }
        }
    })
}

function handleBoatScene(){
    let boatMotionPath = anime.path(".boat-track svg path");
    let boatAnime = anime({
        targets: boat,
        translateX: boatMotionPath("x"),
        translateY: boatMotionPath("y"),
        rotate: [60, 0, -60, 0],
        autoplay: false,
        easing: "linear",
        duration: 4000
    });

    let boatIconAnime = anime({
        targets: ".boat-scene .boat-icon svg",
        rotate: [180, 0],
        translateX: [16, 0],
        easing: "linear",
        duration: 400,
        autoplay: true,
    });

    let routeAnimation = new BoatRouteAnimation( routeWake );
    let scrollTrigger = new ScrollTrigger({
        startTrigger: ".boat-scene .start-scroll-trigger",
        endTrigger: ".boat-scene",
        pointerTop: innerHeight/2,
    });
    scrollTrigger.onUpdate = ()=>{
        boat.classList.remove("boat--anchored");

        let scrollPercent = calPercentage(scrollTrigger.currentPointerY, scrollTrigger.start, scrollTrigger.end);
        let timeStamp = ((scrollPercent / 100) * boatAnime.duration);
        boatAnime.seek(timeStamp);

        let { translateX, translateY } = getTranslateValuesFromMatrix(getComputedStyle(boat).transform);
        routeAnimation.update(translateX, translateY);
    };
    scrollTrigger.onDirection = ()=>{
        if(scrollTrigger.direction === "bottom"){
            boat.classList.remove("boat--north-view");
            
            if(boatIconAnime.reversed) 
                boatIconAnime.reverse();
            
            boatIconAnime.play();
            return;
        }

        if(scrollTrigger.direction === "top"){
            boat.classList.add("boat--north-view");
            boatIconAnime.reverse();
            boatIconAnime.play();
        }
    };
    scrollTrigger.onStop = ()=>{
        boat.classList.add("boat--anchored");
    };
}

function handleBeachScene(){
    let uniqueAnimation = false;
    let beachSceneElement = document.querySelector(".beach-scene");
    let crabMotionPath = anime.path(".beach-scene .crab .crab-track svg path");

    let contactAnime = anime({
        targets: ".beach-scene .contact",
        opacity: [0, 1],
        scale: [0.95, 1],
        perspective: 500,
        translateZ: [5, 0],
        duration: 1000,
        delay: 1000,
        easing: "linear",
        autoplay: false
    });

    let palm1 = anime.timeline({
        easing: 'linear',
        autoplay: false
    });
    palm1.add({
        targets: ".beach-scene .palm-1",
        translateY: [100, 0],
        scale: [2.95, 3],
        opacity: [0, 1],
        duration: 700
    })
    palm1.add({
        targets: ".beach-scene .palm-1",
        rotate: [5, -2, 0],
        duration: 1500
    })

    let palm2 = anime.timeline({
        easing: 'linear',
        autoplay: false
    });
    palm2.add({
        targets: ".beach-scene .palm-2",
        translateY: [100, 0],
        translateX: [0, 50],
        scale: [2.95, 3],
        opacity: [0, 1],
        duration: 700,
        delay: 400
    })
    palm2.add({
        targets: ".beach-scene .palm-2",
        rotate: [-5, 2, 0],
        duration: 1500
    })

    // FLOOD TIMELINE
    const floodTimeline = anime.timeline({
        easing: 'linear',
        autoplay: true
    });
    floodTimeline.add({
        targets: ".beach-scene .wave-3",
        opacity: 1,
        duration: 100,
        delay: 1000,
    })
    floodTimeline.add({
        targets: ".beach-scene .wave-3",
        top: [0, -50],
        scaleY: [1, 5],
        duration: 2000,
        begin(){
            beachSceneElement.classList.add("beach-scene--flood");
        }
    })
    floodTimeline.add({
        targets: ".beach-scene .wave-3",
        opacity: 0,
        scaleY: 0.1,
        scaleX: 1,
        duration: 2000,
        delay: 500,
        complete(){
            beachSceneElement.classList.remove("beach-scene--flood");
        }
    })
    floodTimeline.add({
        targets: crab,
        opacity: {
            value: [0, 1],
            duration: 100
        },
        scale: {
            value: 1,
            duration: 10
        },
        translateX: crabMotionPath("x"),
        translateY: crabMotionPath("y"),
        autoplay: false,
        easing: "linear",
        duration: 5000,
        begin(){
            crab.classList.add("crab-icon--anime");
        },
        complete(){
            crab.classList.remove("crab-icon--anime");
        }
    })
    floodTimeline.add({
        targets: crab,
        scale: [1, 0.8],
        opacity: [1, 0],
        duration: 1000
    })

    // scroll trigger
    new ScrollTrigger({
        startTrigger: ".beach-scene .contact-title",
        endTrigger: ".beach-scene",
        pointerTop: innerHeight-40,
        onStart(){
            if(!uniqueAnimation){
                palm1.play();
                palm2.play();
                contactAnime.play();
            }

            anime.set(".crab", { left: anime.random(100, innerWidth-100) });
            floodTimeline.play();
            
            uniqueAnimation = true;
        }
    });
}

function handleAutoScroll(){
    const as = new AutoScroll({
        speed: 8,
        onEnable(){
            btnAutoScroll.textContent = "Stop!";
            btnAutoScroll.classList.add("auto-scroll--enable");
            btnAutoScroll.classList.remove("d-none");
        },
        onDisable(){
            btnAutoScroll.textContent = "Auto Scroll";
            btnAutoScroll.classList.remove("auto-scroll--enable");
            btnAutoScroll.classList.remove("d-none");
        },
        onRestart(){
            btnAutoScroll.classList.remove("auto-scroll--enable");

            if(innerWidth < 780) 
                return btnAutoScroll.classList.add("d-none");

            btnAutoScroll.textContent = "Go to Home";
        }
    });

    // Minimum scroll height to restart auto scroll
    const MIN_HEIGHT_RESTART = as.scrollHeight - innerHeight;

    btnAutoScroll.onclick = () => {
        if(as.isRestart){
            as.disable();
            
            scrollTo({
                top: 0,
                behavior: "instant"
            });
            return;
        }
            
        if(as.isEnable)
            return as.disable();
    
        if(as.isDisable)
            return as.enable();
    }

    window.onscroll = ()=>{
        if(as.isRestart && scrollY <= MIN_HEIGHT_RESTART)
            return as.disable();

        if(!as.isRestart && as.isDisable && scrollY >= MIN_HEIGHT_RESTART)
            as.restart();
    }
}

class BoatRouteAnimation{
    particleSpace = 2;
    currentParticle = 0;

    update(x, y) {
        this.currentParticle += 1;
        if(this.currentParticle < this.particleSpace) return;

        let wake = document.createElement("span");
        wake.className = "route-wake";
        wake.style.width = "50px";
        wake.style.height = "50px"
        wake.style.top = y+"px"
        wake.style.left = x-25+"px"

        routeWake.appendChild(wake);
        wake.onanimationend = ()=>{
            routeWake.removeChild(wake);
        };

        this.currentParticle = 0;
    }


    reset() {

    }
}



// add an event listener to the window object to listen for scroll events
// window.addEventListener("scroll", main);
main();