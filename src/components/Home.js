import React, { useEffect, useState } from "react";
import "../assets/css/home.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { Modal, Button, Form } from 'react-bootstrap';
import { Scrollbars } from "react-custom-scrollbars-2";
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSync } from '@fortawesome/free-solid-svg-icons'
import About from './About';
import Terms from '../components/Terms'
import "../Terms.css"
import zIndex from "@mui/material/styles/zIndex";
import RazorpayPayment from "./RazorpayPayment";



// added onClick and styles without affect this code when reuse this component 

const ImageLoader = ({ imageUrl,onClick=null,styles={}}) => {
  const [imageData, setImageData] = useState(null);
 
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(imageUrl, {
          headers: {
            Accept: "application/json",
            "ngrok-skip-browser-warning": "98547",
          },
        });
        const blob = await response.blob();
        setImageData(blob);
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    };

    fetchImage();
  }, [imageUrl]); // Dependency on imageUrl to fetch new image when it changes
 
  
  return (
    <div>
      {imageData && ( 
        // added onClick 
        <img   onClick={onClick}
          src={URL.createObjectURL(imageData)}
          alt="Fetched Image" 
          // added styles 
          style={Object.keys(styles).length > 0 ? styles : { maxHeight: '200px' }}
        />
      )}
    </div>
  );
};

const BannerLoader = ({ imageUrl }) => {
  const [imageData, setImageData] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(imageUrl, {
          headers: {
            Accept: "application/json",
            "ngrok-skip-browser-warning": "98547",
          },
        });
        const blob = await response.blob();
        setImageData(blob);
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    };

    fetchImage();
  }, [imageUrl]); // Dependency on imageUrl to fetch new image when it changes

  return (
    <div>
      {imageData && (
        <img
          src={URL.createObjectURL(imageData)}
          alt="Fetched Image"
          style={{ width: '350px', height:'400px', marginRight:'20px' }}
        />
      )}
    </div>
  );
};

const Home = () => {
  const [data, setData] = useState([]);
  const [bannerInfo, setBannerInfo] = useState([]);
  const [paymentSuccess, setPaymentSuccess] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsAccepted,SetTermsAccepted] = useState(false); 
 
//  for image modal and collapse
  const [image,setImage] = useState("");
  const [showImageModal,setShowImageModal] = useState(false); 
  const [expand,setExpand] = useState(null); 

  
  const handleCloseAboutModal = () => setShowAboutModal(false);
  const handleShowAboutModal = () => setShowAboutModal(true); 
  const handleCloseTermsModal = () => setShowTermsModal(false);
  const handleShowTermsModal = () => setShowTermsModal(true);
  const handleCheckboxChange = () => SetTermsAccepted((terms)=>!terms);  
 
   
  // for image modal and collapse
  const handleShowImageModal = ()=>setShowImageModal(true); 
  const handleCloseImageModal = ()=>setShowImageModal(false); 
  const handleChangeImage = (image)=> { 
    setImage(image); 
    handleShowImageModal();
   } 
  const handleExpand = (id)=>{ 
    setExpand((expand)=>expand === id ? null : id)
  }

  useEffect(() => {
    if (data.length == 0) {
      const fetchData = async () => {
        try {
          const response = await fetch('https://ba5c-117-213-103-13.ngrok-free.app/feed/item/', {
            headers: {
              Accept: "application/json",
              "ngrok-skip-browser-warning": "98547",
            },
          });
          let res = await response.json()
          setData(res.data);

          const banner = await fetch('https://ba5c-117-213-103-13.ngrok-free.app/feed/banner',{
            headers: {
              Accept: "application/json",
              "ngrok-skip-browser-warning": "98547",
            },
          });

          let bannerinfo = await banner.json();
          setBannerInfo(bannerinfo);
        } catch (error) {
        } finally {
        }
      };
      fetchData();
    }
  }, []);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [startIndex, setStartIndex] = useState(0);
  const [payLoad, setPayLoad] = useState({
    "id": 0,
    "name": "",
    "email": "",
    "address": "",
    "phone": "",
    "land_mark": "",
    "details": [],
    "payment": 0,
    "paymentId":"",
  });

 const handleRefresh = () => {
    if (window.confirm("Are you sure you want to reset?")) {
      window.location.reload();
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayLoad({ ...payLoad, [name]: value });
  };

  const handleSubmit = () => {
    // Handle form submission here, e.g., send data to server
    console.log(payLoad);
    handleClose();
  };

  const handleClick = () => {
    console.log("btn clk");
    setStartIndex((prevIndex) => (prevIndex + 3) % data.length);
  };

  const [resPrice, setRes] = useState({ "grandQuantity": 0, "grandTotal": 0 })

  useEffect(() => {
    let grandQuantity = 0;
    let grandTotal = 0;
    data.length>0 && data.forEach((category) => {
      grandQuantity += category.quantity
      grandTotal += category.total_price
    })
    setRes({ "grandQuantity": grandQuantity, "grandTotal": grandTotal })
    setPayLoad(prevState => ({
      ...prevState,
      details: data
    }))
  }, [data])

  const updateProduct = (id, productId, quantity) => {


    setData(prevData => {
      const newData = [...prevData];


      newData.forEach(category => {
        if (category.id && category.id === id) {
          category.product.forEach(product => {
            if (product.id === productId) {
              product.quantity = quantity;
              product.total_price = quantity * product.selling_price;
            }
          });

          category.quantity = category.product.reduce((acc, curr) => acc + parseInt(curr.quantity), 0);
          category.total_price = category.product.reduce((acc, curr) => {
            // Parse total_price to a floating-point number
            const totalPrice = parseFloat(curr.total_price);
            
            // Check if totalPrice is a valid number
            if (!isNaN(totalPrice)) {
                // Add totalPrice to accumulator
                return acc + totalPrice;
            } else {
                // Handle invalid values (e.g., log error or skip)
                console.error('Invalid total_price:', curr.total_price);
                return acc;
            }
        }, 0);
        }
      });

      return newData;
    });

  };




  const handlePaymentSuccess = (res) => { 


    setPaymentSuccess(res.res);
    setPaymentId(res.msg);
    if(res.res){
      setShow(false);
    }
    alert("Order placed with payment ID :" + res.msg);
    // window.location.reload();
    const newpayload = payLoad;

    newpayload.paymentId = res.msg;
    newpayload.TotalPayment = resPrice.grandTotal;
    newpayload.quantity = resPrice.grandQuantity;

    axios.post('https://ba5c-117-213-103-13.ngrok-free.app/feed/order/', newpayload, {
      headers: {
        Accept: "application/json",
        "ngrok-skip-browser-warning": "98547",
      },
    })
      .then(response => {
        console.log('POST request successful:', response);
      })
      .catch(error => {
        console.error('Error making POST request:', error);
      });

  };


  return (
    <div>
      <nav className="navbar navbar-light bg-light sticky-top p-1">
        <a class="navbar-brand" href="#">
          <img src="https://mdbcdn.b-cdn.net/img/logo/mdb-transaprent-noshadows.webp" height="20" alt="MDB Logo" loading="lazy" />
        </a>
        <div>
          <button type="button" className="btn btn-outline-primary border me-3">
            Quantity: {resPrice.grandQuantity}
          </button>
          <button type="button" className="btn btn-outline-primary border me-3">
            Total price: ₹{resPrice.grandTotal}
          </button>
          <button type="button" className="btn btn-outline-primary border" onClick={handleRefresh}>
          <FontAwesomeIcon icon={faSync} />
          </button>
        </div>
        <div>
        <Button variant="primary" onClick={handleShowAboutModal}>About Us</Button>
        </div>
        <Modal show={showAboutModal} onHide={handleCloseAboutModal} dialogClassName="custom-modal" size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>About Us</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <About />
        </Modal.Body>
      </Modal>
      </nav>  

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Details </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Name *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                name="name"
                value={payLoad.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPhone">
              <Form.Label>Phone No *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter phone number"
                name="phone"
                value={payLoad.phone}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email *</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={payLoad.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formAddress">
              <Form.Label>Address *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter address"
                name="address"
                value={payLoad.address}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formLandmark">
              <Form.Label>Landmark</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter landmark"
                name="land_mark"
                value={payLoad.land_mark}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mt-3" controlId="acceptTermsCheckbox">
              <Form.Check
                type="checkbox"
                label={<span onClick={handleShowTermsModal} style={{ textDecoration: "underline", cursor: "pointer" }}>I have read and accept the Terms and Conditions</span>}
                checked={termsAccepted}
                onChange={handleCheckboxChange}
              />
            </Form.Group>
          </Form>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>Edit Products</Button>
          <RazorpayPayment amount={resPrice.grandTotal} onSuccess={handlePaymentSuccess} payLoad={payLoad}/>
        </Modal.Footer>
      </Modal>
        <Modal show={showTermsModal} onHide={handleCloseTermsModal} dialogClassName="custom-modal" size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>Terms and Conditions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Terms />
        </Modal.Body>
        <Modal.Footer>
        <Form.Group controlId="acceptTermsCheckbox">
          <Form.Check type="checkbox" label="I read and accept the terms and conditions" />
        </Form.Group>
        <Button variant="secondary" onClick={handleCloseTermsModal}>
          Close
        </Button>
        <Button variant="primary">
          Save Changes
        </Button>
      </Modal.Footer>
      </Modal> 

      

      <div className="container">
        <h1 className="text-center m-4 mb-0">Available Products</h1>


        {data && data.map((category) => ( 
  <div key={category.id}>
    {category.category && category.is_active && (
      <div className="btn btn-outline-primary mb-3 mt-5 d-flex justify-content-between align-items-center" style={{ width: "100%" }}>
        <p className="mb-0">{category.category}</p> 
        <div className="d-flex align-items-center gap-2">
          <p className="mb-0">{`${category.quantity} (₹${category.total_price})`}</p>
        </div>
      </div>
    )}
    {/* Show the content directly without collapse */}
    <div className="row g-5">
      {category.product && category.is_active && category.product.map((item) => (
        item.is_active && (
          <div key={item.id} className="col-lg-4 col-md-6">
            <div className="card rounded-0">
              {/* Image with onClick for changing the image */}
              <ImageLoader onClick={() => handleChangeImage(item)} imageUrl={`https://ba5c-117-213-103-13.ngrok-free.app/${item.product_image}`} />
              <div className="card-body">
                <div className="card-text-container">
                  <p className="card-text">{item.title}</p>
                  <div className="d-flex justify-content-between">
                    <p className="card-text">Actual Price: <span className="text-decoration-line-through text-danger">{item.original_price}</span></p>
                    <p className="card-text" style={{ fontWeight: 'bold' }}>Discount Price: <span className="text-success">{item.selling_price}</span></p>
                  </div>
                  {item.description && (
                    <div className="scrollable-container" style={{ maxHeight: '4rem', overflowY: 'scroll' }}>
                      <p className="card-text" style={{ marginRight: '17px' }}>{item.description}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="d-flex justify-content-between m-2 align-items-center">
                <button type="button" className="btn btn-primary" style={{ fontWeight: 'bold' }} disabled={item.quantity <= 0} onClick={() => updateProduct(category.id, item.id, item.quantity - 1)}>-</button>
                <input type="number" className="form-control" value={item.quantity} style={{ width: "100px" }} min={0} onChange={(e) => updateProduct(category.id, item.id, e.target.value)} />
                <button type="button" className="btn btn-primary" style={{ fontWeight: 'bold' }} onClick={() => updateProduct(category.id, item.id, item.quantity + 1)}>+</button>
                <p className="card-text">Total Price: {item.total_price}</p>
              </div>
            </div>
          </div>
        )
      ))}
    </div>
  </div>
))}


        {/* added Image Modal  */}
        <Modal show={showImageModal} onHide={handleCloseImageModal} dialogClassName="custom-modal" size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>{image.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{height:'80vh'}}>
        <ImageLoader styles={{width:'100%',height:'100%'}}  imageUrl={`https://ba5c-117-213-103-13.ngrok-free.app/${image.product_image}`} />
        </Modal.Body>
      </Modal>
        {/* <h1
          className="text-center"
          style={{ marginTop: "60px", marginBottom: "40px" }}
        >
          OUR SERVICES
        </h1> */}

        {/* <div
          className="d-none d-md-block position-relative"
          style={{ marginBottom: "20px" }}
        >
          <div className="row">
            {bannerInfo && bannerInfo.slice(startIndex, startIndex + 3).map((item, index) => (
              <div key={index} className="col-md-4">
               <BannerLoader imageUrl={`https://ba5c-117-213-103-13.ngrok-free.app/${item.banner_image}`} />
                <div
                  className="d-flex justify-content-center"
                  style={{
                    color: "white",
                    marginTop: "-50px",
                    fontWeight: "bold",
                    zIndex: 3,
                  }}
                >
                  <h3>{item.title}</h3>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "-200px" }}>
            <button
              className="arrow-button"
              onClick={() => handleClick(-3)}
              style={{
                left: 0,
                transform: "translateX(-50%)",
                position: "absolute",
                border: "none",
              }}
            >
              &larr;
            </button>

            <button
              className="arrow-button"
              onClick={() => handleClick(-3)}
              style={{
                position: "absolute",
                right: 0,
                border: "none",
                transform: "translateX(50%)",
              }}
            >
              &rarr;
            </button>
          </div>
        </div> */}
      </div>

      {/* <div style={{ height: "65vh", marginLeft: "30px" }}>
        <Scrollbars>
          <div className="d-md-none container-fluid p-0">
            <div className="d-flex flex-row flex-nowrap">
              {bannerInfo && bannerInfo.map((item, index) => (
                <div key={index} className="mr-2">
                    <BannerLoader imageUrl={`https://ba5c-117-213-103-13.ngrok-free.app/${item.banner_image}`} />
                  <div
                    className="d-flex justify-content-center"
                    style={{
                      color: "white",
                      marginTop: "-50px",
                      fontWeight: "bold",
                      zIndex: 3,
                    }}
                  >
                    <h3>{item.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Scrollbars>
      </div> */}
      {/* <div className="fixed-bottom d-flex justify-content-end p-3" style={{zIndex:"-1"}}> */}
        <button type="button" disabled={resPrice.grandTotal <= 0} className="btn btn-primary" style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
      }} onClick={handleShow}>Proceed to Buy</button>
      {/* </div> */}
    </div>
  );
};

export default Home;
