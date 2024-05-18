
import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import {Navbar as NavbarBs, Button, Modal} from 'react-bootstrap'
import {BsCart} from 'react-icons/bs'
import { FaHome } from "react-icons/fa";

import {CartContext} from '../context/cartContext'
import CartProduct from './cartProduct'

function Navbar(){
    const [showModal, setShowModal]= useState(false);
    const [showError, setShowError] = useState(false);
    const cart = useContext(CartContext);


    const navigate = useNavigate();
    function handleLoginPage(){
        navigate('/Login')
     }
     function handleHomePage(){
        navigate('/')
     }
 

   const productCount =  cart.items.reduce((sum, product)=> sum+ product.quantity, 0)

    const handleShow = ()=> {setShowModal (true)};
    const handleClose = ()=> {setShowModal (false)};
    

   async function checkout(){
    const response = await fetch('http://localhost:3000/api',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({items: cart.items}),
        })

        const data = await response.json()
        
            if (cart.items.length === 0) {
                setShowError(true)
                return;
            }
            if (data.url ){
            window.location.assign(data.url)
        }
    }


    return(
      <>
         <NavbarBs className='border-bottom border-secondary'>
                <Button className='text-white d-flex' variant='btn btn-outline-secondary'>
                       <div onClick={handleLoginPage}>
                        <div>ورود / ثبت نام</div>
                        <Link to='login'></Link>
                       </div>
                 </Button>
             <NavbarBs.Collapse className='justify-content-end m-2'>
                 <Button onClick={handleShow} variant='btn btn-outline-secondary ' 
                 className=' text-white'>
                   ({productCount})  <BsCart className='mx-2'></BsCart>
                     سبد خرید
                 </Button>
             </NavbarBs.Collapse>
                 <Button onClick={handleHomePage} variant="btn btn-outline-secondary  " className='text-white'>
                    <FaHome className='m-1' />خانه
                    <Link to={'/'}></Link>
                 </Button>
         </NavbarBs>


         <Modal show={showModal} onHide={handleClose} contentClassName='card-bg' dir='rtl'>
            <Modal.Header >
                <Modal.Body>
                    {productCount >0 ?(
                        <>
                    <h3 className='mb-4 '> <BsCart className='mx-2'></BsCart>سبد خرید</h3>
                    {cart.items.map((item)=>(
                        <CartProduct key={item.id} id={item.id} quantity={item.quantity}></CartProduct>
                    ))}
                    <p  className="border-bottom border-secondary"></p>
                    <h3 >مجموع قیمت :{cart.getTotalAmount()}</h3>
                        </>
                    ):(
                        <h3>سبد خرید خالی است</h3>
                    )}

                    <Button className='mt-4' variant='btn btn-light' onClick={checkout}>ثبت سفارش</Button>

                    <Button onClick={handleClose} variant='btn btn-outline-secondary' className='mt-4 mx-3 text-white'>بستن</Button>
                    <div className=" text-danger mt-3" style={{ display: showError ? 'block' : 'none' }}>
                          سبد خرید شما خالی است!
                     </div>
                </Modal.Body>
            </Modal.Header>
         </Modal>
        
      </>
    )
}

export default Navbar