import { Link } from 'react-router-dom';

const DashboardCard = ({ title, image, link }) => (
  <Link to={link}>
    <div className="bg-white rounded-xl shadow-md p-4 w-64 hover:shadow-xl transition-all text-center">
      <img
        src={`/assets/${image}`}
        alt={title}
        className="h-32 w-full object-contain mx-auto"
      />
      <h3 className="mt-4 text-lg font-bold">{title}</h3>
    </div>
  </Link>
);

export default DashboardCard;
