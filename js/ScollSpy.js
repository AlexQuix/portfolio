import ScrollTrigger from "./scrollTrigger.js";

export default class ScrollSpy{
    observer = null;
    prevObserver = null;
    nextObserver = null;
    urlTargetId = null;
    ignoreUrlUpdate = true;

    constructor(targets){
        let spies = document.querySelectorAll(targets);
        let matchId = location.hash.match(/#(\w+)/);

        this.missions = [];
        this.urlTargetId = (matchId)? matchId[1] : null;

        spies.forEach((e, i) => {
            let targetId = e.href.match(/#(\w+)/)[1];
            let target = document.getElementById(targetId);

            let st = new ScrollTrigger({
                startTrigger: target, 
                endTrigger: target,
                pointerTop: 0,
                useEventListener: false
            });

            let m = {
                scrollTrigger: st,
                spy: e,
                start: st.start,
                end: st.end,
                targetId: targetId,
                target
            }

            this.missions.push(m);


            if(e instanceof HTMLAnchorElement){
                e.addEventListener("click", function(){
                    this.ignoreUrlUpdate = true;

                    setTimeout(()=>{
                        this.ignoreUrlUpdate = false;
                    }, 1000)
                }.bind(this))
            }

                
            if(targetId === this.urlTargetId){
                this.updateObservers(m, i);
                this.updateSpies();
            }
        });

        setTimeout(()=>{
            this.ignoreUrlUpdate = false;
            window.addEventListener("scroll", this.handleScroll.bind(this));
        }, 1000);
    }

    handleScroll(){
        let neededUpdate = this.changeMission(this.observer);
        if(!neededUpdate) return;

        let i = -1;
        for (let m of this.missions) {
            i += 1;

            let isStart = window.scrollY >= m.start;
            if(!isStart) continue;
            
            let isEnd = window.scrollY <= m.end;
            if(!isEnd) continue;

            this.updateObservers(m, i);
            this.updateSpies();

            if(!this.ignoreUrlUpdate) this.updateUrl();
        }
    }
    updateUrl(){
        location.assign("#"+this.observer.targetId)
    }
    updateSpies(){
        if(this.observer)
            this.observer.spy.classList.add("active");
        if(this.prevObserver)
            this.prevObserver.spy.classList.remove("active");
        if(this.nextObserver)
            this.nextObserver.spy.classList.remove("active");
    }
    updateObservers(info, i){
        this.observer = info;
        this.prevObserver = i > 0 ? this.missions[i-1] : null;
        this.nextObserver = i < this.missions.length ? this.missions[i+1] : null;
    }
    changeMission(mission){
        if(!mission) return true;

        let {start, end} = mission;

        let isStart = window.scrollY >= start;
        if(!isStart) return true;
        
        let isEnd = window.scrollY <= end;
        if(!isEnd) return true;

        return false;
    }
}