import { useState } from 'react';
import { ChevronLeft, Camera, Calendar, Clock, AlertCircle, Shield } from 'lucide-react';
import {useNavigate} from "react-router-dom";

const CreateSplitzPage = () => {
  const [formData, setFormData] = useState({
    splitTitle: '',
    category: '',
    totalAmount: '₦10,000',
    participants: '4',
    costMethod: 'equal',
    includeMe: true,
    startDate: '2025-05-15',
    startTime: '12:00',
    endDate: '2025-05-17',
    endTime: '22:00',
    location: 'Computer Village, Ikeja, Lagos',
    visibility: 5,
    recurrence: 'Weekly',
  });

  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Select Category',
    'Food & Groceries',
    'Transportation',
    'Events & Tickets',
    'Utilities',
    'Entertainment',
    'Other'
  ];

const navigate = useNavigate();

const gotoCreateSplitz = () =>{
  navigate("/dashboard/payment")
}

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) setImageFile(URL.createObjectURL(file));
  };

  const handleCostMethodChange = (method) => {
    setFormData(prev => ({ ...prev, costMethod: method }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      console.log('Form submitted:', formData);
      alert('Splitz created successfully!');
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white px-3 sm:px-6 lg:px-8 py-6">
      <main className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium text-sm sm:text-base">
            <ChevronLeft size={18} /> <span className="hidden sm:inline">Back</span>
          </button>
          <h1 onClick={gotoCreateSplitz} className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 text-center flex-1">
            Create Splittz
          </h1>
          <div className="w-6 sm:w-8 md:w-10" />
        </div>

        {/* Section: What are you splitting */}
        <SectionWrapper>
          <SectionTitle title="What are you splitting?" subtitle="" center />
          <InputField
            label="Split Title"
            placeholder="e.g. Shared Costco Groceries"
            name="splitTitle"
            value={formData.splitTitle}
            onChange={handleInputChange}
          />
          <SelectField
            label="Split Type/Category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            options={categories}
          />
          <FileUpload
            imageFile={imageFile}
            handleFileUpload={handleFileUpload}
          />
        </SectionWrapper>

        {/* Section: Cost & Participants */}
        <SectionWrapper>
          <SectionTitle title="Cost and Participants" />
          <InputField
            label="Total Amount"
            name="totalAmount"
            value={formData.totalAmount}
            onChange={handleInputChange}
          />
          <InputField
            label="Participants Needed (excluding you)"
            type="number"
            name="participants"
            value={formData.participants}
            onChange={handleInputChange}
          />
          <CostMethodField
            costMethod={formData.costMethod}
            handleCostMethodChange={handleCostMethodChange}
          />
          <CheckboxField
            label="I want to be part of the split"
            checked={formData.includeMe}
            onChange={(e) => setFormData(prev => ({ ...prev, includeMe: e.target.checked }))}
          />
        </SectionWrapper>

        {/* Section: Start & End Period */}
        <SectionWrapper>
          <SectionTitle title="Start & End Period" />
          <DateTimeGrid
            formData={formData}
            setFormData={setFormData}
          />
        </SectionWrapper>

        {/* Section: Location & Visibility */}
        <SectionWrapper>
          <SectionTitle title="Location and Timing" />
          <InputField
            label="Split Location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Computer Village, Ikeja, Lagos"
          />
          <RangeField
            label={`Visibility Radius: ${formData.visibility} km`}
            min={0} max={10}
            value={formData.visibility}
            onChange={(e) => setFormData(prev => ({ ...prev, visibility: e.target.value }))}
          />
          <RecurrenceField
            formData={formData}
            setFormData={setFormData}
          />
        </SectionWrapper>

        {/* Section: Rules & Safety */}
        <SectionWrapper>
          <SectionTitle title="Rules and Safety" />
          <RuleItem
            icon={<AlertCircle size={18} className="text-red-600 mt-0.5" />}
            title="Mandatory Refund Rule"
            description="A 5% charge applies if the split is canceled before 70% participation."
            color="red"
          />
          <RuleItem
            icon={<Shield size={18} className="text-green-600 mt-0.5" />}
            title="Secure Payment Protection"
            description="Always active for verified users."
            color="green"
          />
        </SectionWrapper>

        {/* Submit Button */}
        <button
          onClick={handleSubmit && gotoCreateSplitz}
          disabled={isSubmitting}
          className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-70 disabled:cursor-not-allowed text-sm sm:text-base"
        >
          {isSubmitting ? 'Creating Splittz...' : 'Create Splittz'}
        </button>

      </main>
    </div>
  );
};

/* ================= Helper Components ================= */

const SectionWrapper = ({ children }) => (
  <section className="p-4 sm:p-6 rounded-xl shadow-sm bg-white space-y-4 sm:space-y-6">
    {children}
  </section>
);

const SectionTitle = ({ title, subtitle, center }) => (
  <div className={`mb-3 sm:mb-4 ${center ? 'text-center' : ''}`}>
    <h2 className="text-base sm:text-lg font-semibold text-gray-900">{title}</h2>
    {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
  </div>
);

const InputField = ({ label, type='text', name, value, onChange, placeholder }) => (
  <div>
    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white"
    >
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

const FileUpload = ({ imageFile, handleFileUpload }) => (
  <div>
    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Image/Photo (Optional)</label>
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 hover:border-green-500 transition cursor-pointer">
      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center">
        <Camera size={18} className="sm:w-5 sm:h-5 text-gray-400" />
      </div>
      <label className="flex-1 w-full cursor-pointer">
        <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
        <div className="text-center sm:text-left">
          <span className="text-green-600 font-medium text-sm sm:text-base">Choose File</span>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
        </div>
      </label>
    </div>
    {imageFile && (
      <img src={imageFile} alt="Preview" className="mt-3 h-20 sm:h-24 w-full object-cover rounded-lg" />
    )}
  </div>
);

const CostMethodField = ({ costMethod, handleCostMethodChange }) => (
  <div className="space-y-2 sm:space-y-3">
    {['equal', 'custom'].map(method => (
      <button
        key={method}
        onClick={() => handleCostMethodChange(method)}
        type="button"
        className={`w-full p-3 border-2 rounded-lg text-left transition ${costMethod === method ? 'border-green-600 bg-green-50' : 'border-gray-300 hover:border-gray-400'}`}
      >
        <div className="flex items-center gap-2 mb-1">
          <div className={`w-4 h-4 rounded-full border-2 ${costMethod === method ? 'bg-green-600 border-green-600' : 'border-gray-400'}`} />
          <span className="font-medium text-gray-900 text-sm sm:text-base">{method === 'equal' ? 'Equal Split' : 'Custom Split'}</span>
        </div>
        {method === 'equal' && <p className="text-xs text-gray-600 ml-6">All participants pay the same amount.</p>}
      </button>
    ))}
  </div>
);

const CheckboxField = ({ label, checked, onChange }) => (
  <div className="flex items-center gap-2 sm:gap-3 p-3 bg-green-50 rounded-lg">
    <input type="checkbox" checked={checked} onChange={onChange} className="w-4 h-4 accent-green-600 rounded cursor-pointer" />
    <label className="text-xs sm:text-sm font-medium text-gray-700 cursor-pointer">{label}</label>
  </div>
);

const DateTimeGrid = ({ formData, setFormData }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
    {[
      { label: 'Start Date', type: 'date', name: 'startDate', Icon: Calendar },
      { label: 'Start Time', type: 'time', name: 'startTime', Icon: Clock },
      { label: 'End Date', type: 'date', name: 'endDate', Icon: Calendar },
      { label: 'End Time', type: 'time', name: 'endTime', Icon: Clock }
    ].map(field => (
      <div key={field.name}>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 flex items-center gap-2">
          <field.Icon size={14} className="sm:w-4 sm:h-4" /> {field.label}
        </label>
        <input
          type={field.type}
          value={formData[field.name]}
          onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
          className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
        />
      </div>
    ))}
  </div>
);

const RangeField = ({ label, min, max, value, onChange }) => (
  <div>
    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">{label}</label>
    <input
      type="range"
      min={min} max={max}
      value={value}
      onChange={onChange}
      className="w-full h-2 bg-[#E4E4E4] rounded-lg cursor-pointer accent-green-600"
    />
  </div>
);

const RecurrenceField = ({ formData, setFormData }) => (
  <div className="space-y-2 sm:space-y-3">
    <div className="flex flex-wrap gap-2">
      {['Weekly', 'Monthly'].map(freq => (
        <button
          key={freq}
          onClick={() => setFormData(prev => ({ ...prev, recurrence: freq }))}
          type="button"
          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm transition ${formData.recurrence === freq ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          {freq}
        </button>
      ))}
    </div>
  </div>
);

const RuleItem = ({ icon, title, description, color }) => (
  <div className={`p-3 sm:p-4 border-l-4 ${color === 'red' ? 'border-red-500 bg-red-50' : 'border-green-600 bg-green-50'} rounded flex items-start gap-2 sm:gap-3`}>
    {icon}
    <div>
      <h4 className={`font-semibold text-${color}-700 text-xs sm:text-sm mb-1`}>{title}</h4>
      <p className={`text-xs text-${color}-600`}>{description}</p>
    </div>
  </div>
);

export default CreateSplitzPage;
