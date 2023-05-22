/**
    A class representing a slider.
*/
export class Slider{
    /** 
        * The class name for active indicators.
        * @type {string}
    */
    indicatorClass = "active";
    /** 
        * The class name for active slides.
        * @type {string}
    */
    slideClass = "active";
    /** 
        * The ID of the previous slide.
        * @type {string|null}
    */
    prevSlideId = null;
    /** 
        * The ID of the current slide.
        * @type {string|null}
    */
    currentSlideId = null;
    /** 
        * The ID of the previous indicator.
        * @type {string|null}
    */
    prevIndicatorId = null;
    /** 
        * The ID of the current indicator.
        * @type {string|null}
    */
    currentIndicatorId = null;
    /**
        * The function to be executed when shifting indicators.
        * @type {function|null}
    */
    onIndicatorShift = null;
    /**
        * The function to be executed when enabling an indicator.
        * @type {function|null}
    */
    onIndicatorEnable = null;
    /**
        The function to be executed when disabling an indicator.
        @type {function|null}
    */
    onIndicatorDisable = null;
    /**
        The function to be executed when shifting slides.
        @type {function|null}
    */
    onSlideShift = null;
    /**
        The function to be executed when enabling a slide.
        @type {function|null}
    */
    onSlideEnable = null;
    /**
        The function to be executed when disabling a slide.
        @type {function|null}
    */
    onSlideDisable = null;

    loopNextMode = true;

    /**
        Creates an instance of Slider.
        @constructor
        @param {string} targetId - The ID of the target element.
        @throws {Error} Throws an error if the target element cannot be found.
    */
    constructor(targetId){
        this.targetId = targetId;
        this.targetElement = document.getElementById(this.targetId);
        if(!this.targetElement) throw new Error("It could not found the target element");

        this.slideElements = this.targetElement.querySelectorAll(`.slide[data-target="${this.targetId}"]`);
        this.indicatorsBtn = this.targetElement.querySelectorAll(`.indicator[data-target="${this.targetId}"]`);
        
        this.slides = new Map();
        this.indicators = new Map();

        // Iterate over slide elements and add them to the slides map
        for (const slideElement of this.slideElements) {
            let { slide } = slideElement.dataset;
            this.slides.set(`${slide}`, slideElement);

            if(slideElement.classList.contains("active"))
                this.currentSlideId = slide;
        }

        // Iterate over indicator elements and add event listeners
        for (const indicatorBtn of this.indicatorsBtn) {
            let { slide, indicator } = indicatorBtn.dataset;

            this.indicators.set(indicator, indicatorBtn);
            if(indicatorBtn.classList.contains("active"))
                this.currentIndicatorId = indicator;

            indicatorBtn.addEventListener("click", function(){
                this.shiftSlide(slide);
                this.shiftIndicator(indicator);
            }.bind(this));
        }
    }

    /**
        Shifts the indicator to the specified ID.
        @param {string} indicatorId - The ID of the indicator to shift.
        @throws {Error} Throws an error if the indicator cannot be found.
    */
    shiftIndicator(indicatorId){
        let indicator = this.indicators.get(indicatorId);
        if(!indicator) throw new Error("It could not found the indicator");

        this.prevIndicatorId = this.currentIndicatorId;
        let prevElement = this.indicators.get(this.prevIndicatorId);
        this.disableIndicator(prevElement);

        this.currentIndicatorId = indicatorId;
        let currentElement = indicator;
        this.enableIndicator(currentElement);

        if(this.onIndicatorShift) this.onIndicatorShift(this);
    }

    /**
        Enables the specified indicator.
        @param {HTMLElement} indicatorElement - The indicator element to enable.
    */
    enableIndicator(indicatorElement){
        if(indicatorElement) indicatorElement.classList.add(this.indicatorClass);

        if(this.onIndicatorEnable) this.onIndicatorEnable(indicatorElement, this);
    }

    /**
        Disables the specified indicator.
        @param {HTMLElement} indicatorElement - The indicator element to disable.
    */
    disableIndicator(indicatorElement){
        if(indicatorElement) indicatorElement.classList.remove(this.indicatorClass);

        if(this.onIndicatorDisable) this.onIndicatorDisable(indicatorElement, this);
    }

    /**
        Shifts the slide to the specified ID.
        @param {string} slideId - The ID of the slide to shift.
        @throws {Error} Throws an error if the slide cannot be found.
    */
    shiftSlide(slideId){
        let slide = this.slides.get(slideId);
        if(!slide) throw new Error("It could not found the slide");

        this.prevSlideId = this.currentSlideId;
        let prevElement = this.slides.get(this.prevSlideId);
        this.disableSlide(prevElement);

        this.currentSlideId = slideId;
        let currentElement = this.slides.get(this.currentSlideId)
        this.enableSlide(currentElement);

        if(this.onSlideShift) this.onSlideShift(this);
    }

    /**s
        Enables the specified slide.
        @param {HTMLElement} slideElement - The slide element to enable.
    */
    enableSlide(slideElement){
        if(slideElement) slideElement.classList.add(this.slideClass);

        if(this.onSlideEnable) this.onSlideEnable(indicatorElement, this);
    }

    /**
        Disables the specified slide.
        @param {HTMLElement} slideElement - The slide element to disable.
    */
    disableSlide(slideElement){
        if(slideElement) slideElement.classList.remove(this.slideClass);

        if(this.onSlideDisable) this.onSlideDisable(indicatorElement, this);
    }

    getNextIndicator(){
        let entries = [...this.indicators.entries()];
        let keyToFind = this.currentIndicatorId;

        for (let i = 0; i < entries.length; i++) {
            let [key] = entries[i];
            if(keyToFind === key){
                return entries[i+1];
            }
        }
    }

    getInitialIndicator(){
        return [...this.indicators.entries()][0];
    }

    nextSlide(){
        let keyValue = this.getNextIndicator();
        if( !keyValue ){
            if(!this.loopNextMode) return;

            keyValue = this.getInitialIndicator();
        }

        let [ indicatorKey, indicatorElement ] = keyValue;
        let { slide } = indicatorElement.dataset;

        this.shiftSlide(slide);
        this.shiftIndicator(indicatorKey);
    }
}


export function autoSlider(slider, delay = 1000){
    if(!slider) return;

    return {
        id: 0,
        play(){
            this.id = setInterval(()=>{
                slider.nextSlide();
            }, delay);
        },
        stop(){
            clearInterval(this.id);
        }
    }
}