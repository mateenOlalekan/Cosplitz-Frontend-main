// pages/CreateSplitzPage.jsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, Camera, Calendar, Clock, AlertCircle, Shield } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import useSplitStore from '../../store/splitStore';
import { splitService } from '../../services/splitService';
import { SplitFormSchema } from '../../schemas/splitSchemas';

const CreateSplitzPage = () => {
  const navigate = useNavigate();
  const { addSplit, addToCardedSplits, setLoading, setError } = useSplitStore();
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [includeMe, setIncludeMe] = useState(true);
  const [participantsCount, setParticipantsCount] = useState(4);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(SplitFormSchema),
    defaultValues: {
      title: '',
      category: '',
      split_method: 'SpecificAmounts',
      start_date: '2025-05-15',
      end_date: '2025-05-17',
      location: 'Computer Village, Ikeja, Lagos',
      amount: 10000,
      max_participants: 4,
      visibility_radius: 5,
      rules: 'Mandatory Refund Rule: A 5% charge applies if the split is canceled before 70% participation.',
    },
  });

  const categories = [
    { value: '', label: 'Select Category' },
    { value: 'Housing', label: 'Housing' },
    { value: 'Food & Groceries', label: 'Food & Groceries' },
    { value: 'Transportation', label: 'Transportation' },
    { value: 'Events & Tickets', label: 'Events & Tickets' },
    { value: 'Utilities', label: 'Utilities' },
    { value: 'Entertainment', label: 'Entertainment' },
    { value: 'Other', label: 'Other' },
  ];

  const splitMethods = [
    { value: 'SpecificAmounts', label: 'Equal Split', description: 'All participants pay the same amount' },
    { value: 'CustomAmounts', label: 'Custom Split', description: 'Set custom amounts for each participant' },
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setValue('image_url', previewUrl);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      const finalParticipants = includeMe 
        ? Math.max(1, participantsCount - 1)
        : participantsCount;
      
      const splitData = {
        ...data,
        max_participants: finalParticipants,
        amount: typeof data.amount === 'string' 
          ? parseFloat(data.amount.replace(/[^\d.]/g, ''))
          : data.amount,
      };

      const response = await splitService.createSplit(splitData);
      
      addSplit(response);
      
      if (response.split_method === 'SpecificAmounts') {
        addToCardedSplits(response);
      }

      if (response.split_method === 'SpecificAmounts') {
        navigate(`/split-card/${response.id}`);
      } else {
        navigate(`/splits/${response.id}`);
      }

    } catch (error) {
      setError(error.message || 'Failed to create split');
      alert('Failed to create split. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const gotoAllTasks = () => {
    navigate("/all-tasks");
  };

  const selectedSplitMethod = watch('split_method');
  const amount = watch('amount');

  return (
    <div className="min-h-screen bg-white px-3 sm:px-6 lg:px-8 py-6">
      <main className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={gotoAllTasks}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium text-sm sm:text-base"
          >
            <ChevronLeft size={18} /> <span className="hidden sm:inline">View All Tasks</span>
          </button>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 text-center flex-1">
            Create Splittz
          </h1>
          <div className="w-6 sm:w-8 md:w-10" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Section: What are you splitting */}
          <section className="p-6 rounded-xl shadow-sm bg-white space-y-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">What are you splitting?</h2>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Split Title</label>
              <input
                type="text"
                placeholder="e.g. Shared Costco Groceries"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('title')}
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Split Type/Category</label>
              <select
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('category')}
              >
                {categories.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image/Photo (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-green-500 transition cursor-pointer">
                <label className="flex items-center gap-4 cursor-pointer">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Camera size={20} className="text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <div>
                      <span className="text-green-600 font-medium">Choose File</span>
                      <p className="text-sm text-gray-500 mt-1">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                </label>
              </div>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-3 h-48 w-full object-cover rounded-lg"
                />
              )}
            </div>
          </section>

          {/* Section: Cost & Participants */}
          <section className="p-6 rounded-xl shadow-sm bg-white space-y-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Cost and Participants</h2>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Amount (₦)</label>
              <input
                type="number"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none ${
                  errors.amount ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('amount', { valueAsNumber: true })}
              />
              {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Participants Needed (excluding you)
              </label>
              <input
                type="number"
                value={participantsCount}
                onChange={(e) => setParticipantsCount(parseInt(e.target.value) || 1)}
                min={1}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              />
            </div>
            
            <div className="space-y-3">
              {splitMethods.map((method) => (
                <button
                  key={method.value}
                  type="button"
                  onClick={() => setValue('split_method', method.value)}
                  className={`w-full p-3 border-2 rounded-lg text-left transition ${
                    selectedSplitMethod === method.value
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        selectedSplitMethod === method.value
                          ? 'bg-green-600 border-green-600'
                          : 'border-gray-400'
                      }`}
                    />
                    <span className="font-medium text-gray-900 text-sm sm:text-base">
                      {method.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 ml-6">{method.description}</p>
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <input
                type="checkbox"
                checked={includeMe}
                onChange={(e) => setIncludeMe(e.target.checked)}
                className="w-4 h-4 accent-green-600 rounded cursor-pointer"
              />
              <label className="text-sm font-medium text-gray-700 cursor-pointer">
                I want to be part of the split
              </label>
            </div>
          </section>

          {/* Section: Start & End Period */}
          <section className="p-6 rounded-xl shadow-sm bg-white space-y-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Start & End Period</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar size={16} /> Start Date
                </label>
                <input
                  type="date"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none ${
                    errors.start_date ? 'border-red-500' : 'border-gray-300'
                  }`}
                  {...register('start_date')}
                />
                {errors.start_date && <p className="mt-1 text-sm text-red-600">{errors.start_date.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar size={16} /> End Date
                </label>
                <input
                  type="date"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none ${
                    errors.end_date ? 'border-red-500' : 'border-gray-300'
                  }`}
                  {...register('end_date')}
                />
                {errors.end_date && <p className="mt-1 text-sm text-red-600">{errors.end_date.message}</p>}
              </div>
            </div>
          </section>

          {/* Section: Location & Visibility */}
          <section className="p-6 rounded-xl shadow-sm bg-white space-y-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Location and Timing</h2>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Split Location</label>
              <input
                type="text"
                placeholder="Computer Village, Ikeja, Lagos"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none ${
                  errors.location ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('location')}
              />
              {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Visibility Radius: {watch('visibility_radius')} km
              </label>
              <input
                type="range"
                min="0"
                max="10"
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                {...register('visibility_radius', { valueAsNumber: true })}
              />
            </div>
          </section>

          {/* Section: Rules & Safety */}
          <section className="p-6 rounded-xl shadow-sm bg-white space-y-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Rules and Safety</h2>
            </div>
            
            <div className="p-4 border-l-4 border-red-500 bg-red-50 rounded flex items-start gap-3">
              <AlertCircle size={18} className="text-red-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-700 text-sm mb-1">Mandatory Refund Rule</h4>
                <p className="text-xs text-red-600">A 5% charge applies if the split is canceled before 70% participation.</p>
              </div>
            </div>
            
            <div className="p-4 border-l-4 border-green-600 bg-green-50 rounded flex items-start gap-3">
              <Shield size={18} className="text-green-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-700 text-sm mb-1">Secure Payment Protection</h4>
                <p className="text-xs text-green-600">Always active for verified users.</p>
              </div>
            </div>
          </section>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating Splittz...' : 'Create Splittz'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default CreateSplitzPage;