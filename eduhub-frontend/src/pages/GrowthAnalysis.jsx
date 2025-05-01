import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { Bar, Line, Pie, Radar } from 'react-chartjs-2';
import { FiBarChart, FiPieChart, FiTrendingUp, FiClock, FiAward } from 'react-icons/fi';
import { 
  Chart as ChartJS, 
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { learningProgressService } from '../api/apiClient';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

function GrowthAnalysis() {
  const [activeTab, setActiveTab] = useState('overview');
  const [learningData, setLearningData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    
    // Fetch learning progress data
    const fetchData = async () => {
      try {
        if (!userId) {
          throw new Error('User ID not found. Please log in again.');
        }
        
        setLoading(true);
        const response = await learningProgressService.getUserProgress(userId);
        setLearningData(response.data);
      } catch (error) {
        console.error('Error fetching learning data:', error);
        
        // For development, create mock data if API fails
        setLearningData(generateMockData());
        
        if (error.response?.data?.message) {
          setError(error.response.data.message);
        } else {
          setError('Failed to load learning data. Using sample data instead.');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Generate mock data for development and testing
  const generateMockData = () => {
    return {
      totalHoursSpent: 87,
      coursesCompleted: 5,
      averageScore: 85,
      streakDays: 12,
      skillsGained: ['JavaScript', 'React', 'MongoDB', 'Express', 'Node.js'],
      courseDistribution: {
        academic: 65,
        coCurricular: 35,
        video: 70,
        theory: 30
      },
      weeklyGoals: {
        studyHours: {
          target: 15,
          achieved: 12
        },
        coursesCompleted: {
          target: 1,
          achieved: 1
        }
      },
      progressHistory: [
        { date: '2023-01-01', hoursSpent: 2 },
        { date: '2023-01-08', hoursSpent: 3 },
        { date: '2023-01-15', hoursSpent: 5 },
        { date: '2023-01-22', hoursSpent: 2 },
        { date: '2023-01-29', hoursSpent: 6 },
        { date: '2023-02-05', hoursSpent: 4 },
        { date: '2023-02-12', hoursSpent: 7 },
        { date: '2023-02-19', hoursSpent: 8 },
        { date: '2023-02-26', hoursSpent: 6 },
        { date: '2023-03-05', hoursSpent: 5 },
        { date: '2023-03-12', hoursSpent: 9 },
        { date: '2023-03-19', hoursSpent: 7 }
      ],
      assessments: [
        { courseId: '1', score: 85, date: '2023-01-15' },
        { courseId: '2', score: 92, date: '2023-02-10' },
        { courseId: '3', score: 78, date: '2023-02-25' },
        { courseId: '4', score: 88, date: '2023-03-05' },
        { courseId: '5', score: 95, date: '2023-03-20' }
      ]
    };
  };
  
  // Chart configurations
  const studyTimeChartData = {
    labels: learningData?.progressHistory?.map(entry => 
      new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    ) || [],
    datasets: [
      {
        label: 'Hours Spent',
        data: learningData?.progressHistory?.map(entry => entry.hoursSpent) || [],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.3,
        fill: true,
        backgroundColor: 'rgba(75, 192, 192, 0.2)'
      }
    ]
  };
  
  const courseDistributionData = {
    labels: ['Academic', 'Co-Curricular'],
    datasets: [
      {
        data: learningData ? [
          learningData.courseDistribution.academic,
          learningData.courseDistribution.coCurricular
        ] : [60, 40],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)'
        ],
        borderWidth: 1
      }
    ]
  };
  
  const learningModeData = {
    labels: ['Video', 'Theory'],
    datasets: [
      {
        data: learningData ? [
          learningData.courseDistribution.video,
          learningData.courseDistribution.theory
        ] : [70, 30],
        backgroundColor: [
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)'
        ],
        borderWidth: 1
      }
    ]
  };
  
  const assessmentScoresData = {
    labels: learningData?.assessments?.map((_, index) => `Assessment ${index + 1}`) || [],
    datasets: [
      {
        label: 'Assessment Scores',
        data: learningData?.assessments?.map(assessment => assessment.score) || [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1
      }
    ]
  };
  
  const skillsRadarData = {
    labels: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'CSS', 'HTML'],
    datasets: [
      {
        label: 'Current Skills',
        data: [85, 78, 70, 65, 90, 95],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgb(54, 162, 235)',
        pointBackgroundColor: 'rgb(54, 162, 235)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(54, 162, 235)'
      }
    ]
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-slate-200">Loading your learning analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 text-slate-200 min-h-screen pb-10">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-teal-400 mb-8">Personal Growth Analysis</h1>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        {/* Stats Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
            <div className="flex items-center">
              <div className="bg-teal-500/20 p-3 rounded-lg mr-4">
                <FiClock className="text-teal-400 text-xl" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Total Study Hours</p>
                <p className="text-2xl font-bold text-slate-100">{learningData?.totalHoursSpent || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
            <div className="flex items-center">
              <div className="bg-indigo-500/20 p-3 rounded-lg mr-4">
                <FiAward className="text-indigo-400 text-xl" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Courses Completed</p>
                <p className="text-2xl font-bold text-slate-100">{learningData?.coursesCompleted || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
            <div className="flex items-center">
              <div className="bg-purple-500/20 p-3 rounded-lg mr-4">
                <FiTrendingUp className="text-purple-400 text-xl" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Average Score</p>
                <p className="text-2xl font-bold text-slate-100">{learningData?.averageScore || 0}%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
            <div className="flex items-center">
              <div className="bg-pink-500/20 p-3 rounded-lg mr-4">
                <FiBarChart className="text-pink-400 text-xl" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Current Streak</p>
                <p className="text-2xl font-bold text-slate-100">{learningData?.streakDays || 0} days</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Weekly Goals Section */}
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg mb-8">
          <h2 className="text-xl font-bold text-slate-100 mb-4">Weekly Goals Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-slate-400 mb-2">Study Hours: {learningData?.weeklyGoals?.studyHours?.achieved || 0}/{learningData?.weeklyGoals?.studyHours?.target || 0} hours</p>
              <div className="w-full bg-slate-700 rounded-full h-4">
                <div 
                  className="bg-teal-500 h-4 rounded-full" 
                  style={{ 
                    width: `${Math.min(
                      (learningData?.weeklyGoals?.studyHours?.achieved || 0) / 
                      (learningData?.weeklyGoals?.studyHours?.target || 1) * 100, 
                      100
                    )}%` 
                  }}
                ></div>
              </div>
            </div>
            
            <div>
              <p className="text-slate-400 mb-2">Courses: {learningData?.weeklyGoals?.coursesCompleted?.achieved || 0}/{learningData?.weeklyGoals?.coursesCompleted?.target || 0} completed</p>
              <div className="w-full bg-slate-700 rounded-full h-4">
                <div 
                  className="bg-indigo-500 h-4 rounded-full" 
                  style={{ 
                    width: `${Math.min(
                      (learningData?.weeklyGoals?.coursesCompleted?.achieved || 0) / 
                      (learningData?.weeklyGoals?.coursesCompleted?.target || 1) * 100, 
                      100
                    )}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="border-b border-slate-700 mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 font-medium text-sm border-b-2 ${
                activeTab === 'overview'
                  ? 'border-teal-400 text-teal-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              Study Overview
            </button>
            <button
              onClick={() => setActiveTab('courses')}
              className={`py-4 px-1 font-medium text-sm border-b-2 ${
                activeTab === 'courses'
                  ? 'border-teal-400 text-teal-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              Course Distribution
            </button>
            <button
              onClick={() => setActiveTab('assessment')}
              className={`py-4 px-1 font-medium text-sm border-b-2 ${
                activeTab === 'assessment'
                  ? 'border-teal-400 text-teal-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              Assessment Scores
            </button>
            <button
              onClick={() => setActiveTab('skills')}
              className={`py-4 px-1 font-medium text-sm border-b-2 ${
                activeTab === 'skills'
                  ? 'border-teal-400 text-teal-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              Skills Progression
            </button>
          </nav>
        </div>
        
        {/* Charts Section */}
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg mb-8">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-xl font-bold text-slate-100 mb-6">Study Time Distribution</h2>
              <div className="h-80">
                <Line 
                  data={studyTimeChartData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                          color: 'rgba(255, 255, 255, 0.7)'
                        }
                      },
                      x: {
                        grid: {
                          color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                          color: 'rgba(255, 255, 255, 0.7)'
                        }
                      }
                    },
                    plugins: {
                      legend: {
                        labels: {
                          color: 'rgba(255, 255, 255, 0.7)'
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          )}
          
          {activeTab === 'courses' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-bold text-slate-100 mb-6">Course Type Distribution</h2>
                <div className="h-64">
                  <Pie 
                    data={courseDistributionData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: {
                            color: 'rgba(255, 255, 255, 0.7)'
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-bold text-slate-100 mb-6">Learning Mode Distribution</h2>
                <div className="h-64">
                  <Pie 
                    data={learningModeData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: {
                            color: 'rgba(255, 255, 255, 0.7)'
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'assessment' && (
            <div>
              <h2 className="text-xl font-bold text-slate-100 mb-6">Assessment Performance</h2>
              <div className="h-80">
                <Bar 
                  data={assessmentScoresData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                          color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                          color: 'rgba(255, 255, 255, 0.7)'
                        }
                      },
                      x: {
                        grid: {
                          color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                          color: 'rgba(255, 255, 255, 0.7)'
                        }
                      }
                    },
                    plugins: {
                      legend: {
                        labels: {
                          color: 'rgba(255, 255, 255, 0.7)'
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          )}
          
          {activeTab === 'skills' && (
            <div>
              <h2 className="text-xl font-bold text-slate-100 mb-6">Skills Proficiency</h2>
              <div className="h-80">
                <Radar 
                  data={skillsRadarData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                          backdropColor: 'transparent',
                          color: 'rgba(255, 255, 255, 0.7)'
                        },
                        grid: {
                          color: 'rgba(255, 255, 255, 0.1)'
                        },
                        angleLines: {
                          color: 'rgba(255, 255, 255, 0.2)'
                        },
                        pointLabels: {
                          color: 'rgba(255, 255, 255, 0.7)'
                        }
                      }
                    },
                    plugins: {
                      legend: {
                        labels: {
                          color: 'rgba(255, 255, 255, 0.7)'
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Skills Gained Section */}
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold text-slate-100 mb-4">Skills Gained</h2>
          <div className="flex flex-wrap gap-2">
            {learningData?.skillsGained?.map((skill, index) => (
              <span 
                key={index} 
                className="bg-teal-500/20 text-teal-300 px-3 py-1 text-sm rounded-full"
              >
                {skill}
              </span>
            )) || (
              <span className="text-slate-400">No skills recorded yet</span>
            )}
          </div>
        </div>
        
        {/* Action Section */}
        <div className="mt-8 text-center">
          <Link
            to="/courses"
            className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
          >
            Explore More Courses
          </Link>
        </div>
      </div>
    </div>
  );
}

export default GrowthAnalysis;
