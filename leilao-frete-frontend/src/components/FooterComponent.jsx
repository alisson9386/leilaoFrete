import React from 'react';
import { MDBFooter } from 'mdb-react-ui-kit';

const FooterComponent = () => {
 return (
    <MDBFooter bgColor='dark' className='text-center text-sm-left' style={{ position: 'fixed', bottom: '0', width: '100%' }}>
      <div className='text-center p-3' style={{ color: 'white' }}>
        &copy; {new Date().getFullYear()} Copyright:{' '}
        <a className='text-light' target="_blank" rel="noreferrer" href='https://www.buritti.com.br/'>
          Buritti.com.br
        </a>
      </div>
    </MDBFooter>
 );
};

export default FooterComponent;
