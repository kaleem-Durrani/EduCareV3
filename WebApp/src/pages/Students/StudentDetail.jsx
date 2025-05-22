import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

export default function StudentDetail() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get(`/api/student/${id}/basic-info`);
        setStudent(response.data.basicInfo);
      } catch (err) {
        setError('Failed to fetch student details');
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {student.fullName}
            </h1>
            <p className="text-gray-600">{student.class}</p>
          </div>
          <Link
            to={`/students/${id}/edit`}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Edit Profile
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <InfoSection title="Basic Information">
              <InfoItem label="Age" value={student.age} />
              <InfoItem label="Birthdate" value={new Date(student.birthdate).toLocaleDateString()} />
              <InfoItem label="Authorized Photos" value={student.authorizedPhotos ? 'Yes' : 'No'} />
            </InfoSection>

            <InfoSection title="Schedule">
              <InfoItem label="Time" value={student.schedule.time} />
              <InfoItem label="Days" value={student.schedule.days} />
            </InfoSection>
          </div>

          <div className="space-y-4">
            <InfoSection title="Preferences">
              <InfoItem label="Allergies" value={student.allergies.join(', ')} />
              <InfoItem label="Likes" value={student.likes.join(', ')} />
            </InfoSection>

            <InfoSection title="Additional Information">
              <p className="text-gray-600">{student.additionalInfo}</p>
            </InfoSection>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoSection({ title, children }) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {children}
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="flex justify-between py-2 border-b border-gray-200">
      <span className="text-gray-600">{label}</span>
      <span className="text-gray-900">{value}</span>
    </div>
  );
}