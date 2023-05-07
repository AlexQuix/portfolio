/**
 * ScrollTrigger class creates a scroll trigger that fires events when the user scrolls between two HTML elements on a page.
 * It also allows you to add a pointer to the body of the document that indicates the position of the scroll.
*/
export default class ScrollTrigger {
    // Class properties
    scrollTimeout = 0; // A variable to hold the ID of the timeout used to detect when scrolling has stopped
    prevScrollY = 0; // Keep track of the previous scroll position to determine scroll direction
    direction = "bottom"; // A variable to keep track of the current scroll direction ("top" or "bottom")
    start = 0; // The vertical position of the bottom edge of the start element
    end = 0; // The vertical position of the top edge of the end element
    pointerTop = 0; // The vertical position of the pointer
    currentPointerY= 0; // The current vertical position of the pointer
    lengthTrigger = 0; // The length between the start and end triggers
    isInside = false; // A flag to keep track if the pointer is inside the trigger range
    hasStarted = false;
    hasEnded = false;
  
    /**
     * The constructor function that creates a new instance of the ScrollTrigger class.
     * @param {Object} options - An object that contains the start and end triggers, the pointer top position, and the callbacks for the events.
    */
    constructor({ 
        startTrigger = "", 
        endTrigger = "",
        pointerTop = 0,
        onUpdate = ()=>{},
        onStop = ()=>{},
        onStart = ()=>{},
        onEnd = ()=>{},
        onDirection = ()=>{},
        useEventListener = true
    }) {
        // Find the start and end elements on the page and get their positions
        let startElem = (typeof startTrigger === "string") 
                            ? document.querySelector(startTrigger)
                            : startTrigger;
        let startRect = startElem.getBoundingClientRect();
        let endElem = (typeof startTrigger === "string")
                            ? document.querySelector(endTrigger)
                            : endTrigger;
        let endRect = endElem.getBoundingClientRect();
    
        // Set the start and end positions based on the element positions
        this.start = startRect.top + window.scrollY;
        this.end = endRect.bottom + window.scrollY;

        // Set the pointer top position, trigger length, and event callbacks
        this.pointerTop = pointerTop;
        this.lengthTrigger = Math.abs(this.end - this.start);
        this.onUpdate = onUpdate;
        this.onStop = onStop;
        this.onStart = onStart;
        this.onEnd = onEnd;
        this.onDirection = onDirection;
    
        // Call the handleUpdate
        this.handleUpdate();
        
        if(useEventListener){
            // Add event listeners for scroll events
            window.addEventListener("scroll", this.handleStop.bind(this));
            window.addEventListener("scroll", this.handleScroll.bind(this));
        }
    }
  
    /**
     * A method to handle the scroll stop event.
     * It clears the previous timeout (if it exists) and sets a new timeout to detect when scrolling has stopped.
    */
    handleStop() {
        // Clear the previous timeout (if it exists)
        clearTimeout(this.scrollTimeout);
    
        this.scrollTimeout = setTimeout(() => {
            this.onStop();
        }, 250); // Wait 250 milliseconds before triggering the onStop event
    }
  
    /**
     * A method to handle the scrolling event.
    */
    handleScroll() {
        this.currentPointerY = this.pointerTop + scrollY;

        this.handleDirection();
        this.handleUpdate();

        this.prevScrollY = window.scrollY;
    }

    /**
     * A method to handle the update event
     * It checks if the user is currently scrolling between the start and end elements,
     * and calls the onStart, onEnd, and onUpdate functions if they exist.
    */
    handleUpdate(){
        // Check if the user is currently scrolling between the start and end elements
        let isStart = this.currentPointerY >= this.start;
        if(!isStart){
            this.hasStarted = false;
            this.isInside = false;
            return;
        }
        if(!this.hasStarted){
            this.hasStarted = true;
            this.onStart();
        }

        let isEnd = this.currentPointerY <= this.end;
        if(!isEnd){
            this.hasEnded = false;
            this.isInside = false;
            return;
        }
        if(!this.hasEnded){
            this.hasEnded = true;
            this.onEnd();
        }

        // If the user is scrolling between the elements and an onScrolling function exists,
        // call it
        this.isInside = true;
        this.onUpdate();
    }

    /**
     * A method to handle the direction event
     * It checks the current direction and update it and calls onDirection event
     */
    handleDirection(){
        let is = this.prevScrollY < window.scrollY;
        if(is && this.direction !== "bottom"){
            this.direction = "bottom";
            this.onDirection();
            return;
        }

        if(!is && this.direction !== "top"){
            this.direction = "top";
            this.onDirection();
            return;
        }
    }

    /**
     * Adds an start and end element to the body, that indicates the position of the 
     * start trigger and end trigger
    */
    addCoordinates() {
        // Convert the start and end values to a fixed number and create span elements
        let startFixed = this.start.toFixed();
        let startSpan = document.createElement("span");
        startSpan.innerText = `Start: ${startFixed}`;
        startSpan.style.position = "absolute";
        startSpan.style.top = startFixed+"px";
        startSpan.style.zIndex = "999";

        let endSpan = document.createElement("span");
        let endFixed = this.end.toFixed();
        endSpan.innerText = `End: ${endFixed}`;
        endSpan.style.position = "absolute";
        endSpan.style.top = endFixed+"px";
        endSpan.style.zIndex = "999";

        // Add the span elements to the DOM
        document.body.appendChild(startSpan);
        document.body.appendChild(endSpan);
    }

    /**
        * A method that adds a pointer to the body of the document.
    */
    addPointer() {
        // Create a div element to use as the pointer
        const pointer = document.createElement("div");
        pointer.style.position = "fixed";
        pointer.style.top = this.pointerTop+"px";
        pointer.style.width = "10px";
        pointer.style.height = "10px";
        pointer.style.background = "red";
        pointer.style.borderRadius = "50%";
        pointer.style.zIndex = "999";
    
        // Add the pointer to the body of the document
        document.body.appendChild(pointer);
    }
}
