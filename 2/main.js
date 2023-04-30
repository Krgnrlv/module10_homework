const btn = document.querySelector('.btn');
btn.addEventListener('click',()=>{
    let width=window.screen.width;
    let height=window.screen.height;
    console.log(width)
    window.alert(`Ширина -> ${width}px \nВысота -> ${height}px`)
})