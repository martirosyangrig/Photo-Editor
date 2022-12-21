"use state";

const fileInpute = document.querySelector('.save input');
const chooseBtn = document.querySelector('.save .choose');
const ourImg = document.querySelector('.img img');
const filterRange = document.querySelectorAll('.fillters input');
const resetBtn = document.querySelector('.reset button');
const rotateBtns = document.querySelectorAll('.rotation .btns button');
const saveBtn = document.querySelector('.save .saveBtn');


let brightnes = 100,
    saturation = 100,
    inversion = 0,
    rotate = 0,
    flipHorizontal = 1;
    flipVertical = 1;


function giveFillter () { // adding filter in every range change
    ourImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`
    ourImg.style.filter = `brightness(${brightnes}%) saturate(${saturation}%) invert(${inversion}%)`
          
}

function reset () { // reseting fillters
    brightnes = 100;
    saturation = 100;
    inversion = 0;
    
    filterRange.forEach(el =>{
        let val = el.previousElementSibling.firstElementChild.nextElementSibling;

        if(el.id === "Inversion"){
            el.value = inversion
            val.textContent = inversion +"%"
        }else{
            el.value = brightnes
            val.textContent = brightnes +"%"
        }
        
        
    })

    giveFillter()
}





rotateBtns.forEach(btn =>{ // clicking buttons rotating
    btn.addEventListener("click", ()=>{
        if(btn.id === "left"){
            rotate += 90;
        }else if(btn.id === "right") {
            rotate -= 90;
        }else if(btn.id = "horizontal"){
            flipHorizontal = flipHorizontal === 1 ? -1 : 1;
        }else{
            flipVertical = flipVertical === 1 ? -1 : 1;
        }
        giveFillter()
    })
})


chooseBtn.addEventListener("click", ()=>{ // choosing img
    fileInpute.click()
})


fileInpute.addEventListener("change", ()=>{ // getting image from pc
    const file = fileInpute.files[0]
    if(!file){
        return;
    }
    ourImg.src = URL.createObjectURL(file)
    ourImg.addEventListener("load", ()=>{
        document.querySelector('.settings').classList.remove("disable");
        document.querySelector('.saveBtn').classList.remove("disable");
    })
    reset()
})



filterRange.forEach(range =>{ // giving our choosed range value to img 

   range.addEventListener("input", ()=>{
    let val = range.previousElementSibling.firstElementChild.nextElementSibling;
    val.textContent = range.value + "%"
    
    if (val.previousElementSibling.textContent === "Brightnees") {
        brightnes = parseInt(val.textContent);
    }else if(val.previousElementSibling.textContent === "Saturation" ){
        saturation = parseInt(val.textContent);
    }else{
        inversion = parseInt(val.textContent);
    }
 
    giveFillter()
   })
})


function saveImg () { // saving filltered img using canvas

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")
    canvas.width = ourImg.naturalWidth;
    canvas.height = ourImg.naturalHeight;
    
    ctx.filter = `brightness(${brightnes}%) saturate(${saturation}%) invert(${inversion}%)`;
    ctx.translate(canvas.width / 2, canvas.height / 2)

    if(rotate !== 0){
        ctx.rotate(rotate * Math.PI / 180)
    }

    ctx.scale(flipHorizontal, flipVertical)
    ctx.drawImage(ourImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height)

    document.querySelector('.savedImg').append(canvas);
    const link = document.createElement("a")
    link.download = "image/jpg"
    link.href = canvas.toDataURL()
    link.click()
}

resetBtn.addEventListener("click", reset)
saveBtn.addEventListener("click", saveImg)