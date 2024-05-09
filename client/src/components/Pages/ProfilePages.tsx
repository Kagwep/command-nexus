
import Navbar from '../Navbar';
import '../../css/App.scss';
import ProfileHeader from '../ProfileHeader';
import Footer from '../Footer';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom';



const ProfilesPage = () => {
  return (
        <>
        
          <Navbar />
          <div className="text-center">
            <Link to='/'>
              <button className='text-white'> <ArrowBackIcon  sx={{
                color:'blue',
                fontSize:20
              }} /> </button>
              </Link>
           </div>
          <ProfileHeader />
          <Footer />
        </>
  );
}

export default ProfilesPage;