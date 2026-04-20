import './Menu.css';

function Menu(){
    
    const saySomething = () =>{
        console.log("something");
    }
    return(
        <div id="menu">
            <h1 onClick={saySomething}>Bienvenido a travelAgency</h1>
            <h2>¿A donde desea viajar hoy?</h2>
        </div>
    )
}
export default Menu;