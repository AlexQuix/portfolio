/**
    * A class that enables, disables and restart the scroll.
    * 
    @param {Object} options - The options for configuring the AutoScroll class.
    @param {number} options.speed - The speed of the scrolling.
    @param {Function} options.onRestart - The function to call when the scrolling is restarted.
    @param {Function} options.onEnable - The function to call when the scrolling is enabled.
    @param {Function} options.onDisable - The function to call when the scrolling is disabled.
*/
export default class AutoScroll{
    isEnable = false; // A property to know if auto-scroll is enabled.
    isDisable = true; // A property to know if auto-scroll is disable.
    isRestart = false; // A property to know if auto-scroll is restart.
    progress = 0; // The progress of the scroll
    scrollHeight = 0; // The scroll height of the document
    speed = 7; // The speed of the scroll
    onScroll = ()=>{}; // This method is responsable will be use in scroll event 

    constructor({
        speed,
        onRestart = ()=>{},
        onEnable = ()=>{},
        onDisable = ()=>{}
    }){
        this.progress = scrollY;
        this.speed = speed;
        this.scrollHeight = document.documentElement.scrollHeight - innerHeight;

        this.onRestart = onRestart.bind(this);
        this.onEnable = onEnable.bind(this);
        this.onDisable = onDisable.bind(this);
        this.onScroll = this.handleScroll.bind(this);
    }

    /**
        * Verify if the auto-scroll is enable and call the update
    */
    handleScroll(){
        if(this.isEnable) 
            this.update();
    }
    
    /**
        * Is responsible for updating the scrolling position on the page
    */
    update(){
        this.progress += this.speed;

        // If the auto-scroll is disabled, it will call the disable method.
        if(this.isDisable)
            return this.disable();

        // If progress exceeds the scroll height, call the restart method
        if(this.progress >= this.scrollHeight)
            return this.restart();

        // Scroll to the new position
        window.scrollTo({
            top: this.progress,
            behavior: "instant"
        });
    }

    /**
        * Restart the auto scroll feature.
    */
    restart(){
        this.isEnable = false;
        this.isDisable = false;
        this.isRestart = true;

        this.progress = scrollY;
        this.onRestart();

        // Removes the scroll event listener from the window.
        window.removeEventListener("scroll", this.onScroll);
    }

    /**
        * Enable the auto scroll feature.
    */
    enable(){
        this.isEnable = true;
        this.isDisable = false;
        this.isRestart = false;

        this.progress = scrollY;
        this.onEnable();
        // Starts the update loop
        this.update();

        // Adds a scroll event listener to the window to continue updating.
        window.addEventListener("scroll", this.onScroll);
    }

    /**
        * Disable the auto scroll feature.
    */
    disable(){
        this.isEnable = false;
        this.isDisable = true;
        this.isRestart = false;

        this.progress = scrollY;
        this.onDisable();

        // Removes the scroll event listener from the window.
        window.removeEventListener("scroll", this.onScroll);
    }
}
