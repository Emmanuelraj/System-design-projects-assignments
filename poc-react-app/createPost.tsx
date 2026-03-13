import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';

const dropdownData: Record<string, string[]> = {
    Fruit: ["Apple", "Pineapple", "Banana", "Grapes"],
    Country: ["India", "USA", "France", "Japan"]
};

export function CreatePost() {
    const navigate = useNavigate();

    // Refs for scrolling
    const titleRef = useRef<HTMLDivElement>(null);
    const detailsRef = useRef<HTMLDivElement>(null);
    const uploadRef = useRef<HTMLDivElement>(null);

    const [title, setTitle] = useState('');
    const [tags, setTags] = useState('');
    const [type, setType] = useState('');
    const [category, setCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const handleBlur = (field: string) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const handlePublish = () => {
        setIsSubmitted(true);
        setTouched({ title: true, tags: true, type: true });
        if (title && tags && type) {
            console.log("Publishing...");
        } else {
            // Scroll to the first error
            if (!title) scrollToSection(titleRef);
            else if (!tags || !type) scrollToSection(detailsRef);
        }
    };

    const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
        ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const ValidationIcon = () => (
        <div className="cp-validation-dot">
            !
        </div>
    );

    const showError = (field: string, value: string) => {
        return (isSubmitted || touched[field]) && !value;
    };

    return (
        <div className="cp-page">
            <Navbar username="Emmanuel Raj" />

            <div className="cp-container">

                {/* Left Navigation Sidebar */}
                <div className="cp-sidebar top-[100px]">
                    <button 
                        onClick={() => navigate('/home')}
                        className="flex items-center gap-2 text-gray-500 hover:text-black mb-2 transition-colors font-bold text-sm group"
                    >
                        <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
                        Back to Home
                    </button>

                    <div className="border-b border-gray-100 mb-2"></div>

                    <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest text-center">Navigation</h3>
                    <div className="space-y-4 font-semibold text-sm">
                        <button
                            onClick={() => scrollToSection(titleRef)}
                            className="cp-nav-button group"
                        >
                            <span className="group-hover:text-black transition-colors">Post title</span>
                            {showError('title', title) && <ValidationIcon />}
                        </button>
                        <button
                            onClick={() => scrollToSection(detailsRef)}
                            className="cp-nav-button group text-gray-400"
                        >
                            <span className="group-hover:text-black transition-colors">Post Details</span>
                            {(showError('tags', tags) || showError('type', type)) && <ValidationIcon />}
                        </button>
                        <button
                            onClick={() => scrollToSection(uploadRef)}
                            className="cp-nav-button group text-gray-400"
                        >
                            <span className="group-hover:text-black transition-colors">Media Upload</span>
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="cp-main-column">
                    <div className="text-xl font-bold mb-2">
                        Create your post in few steps
                    </div>

                    {/* Post Title Section */}
                    <div ref={titleRef} className="cp-card !scroll-mt-[100px]">
                        <div className="flex items-center gap-3">
                            <label className="font-bold text-xl tracking-tight">Post title</label>
                            {showError('title', title) && <ValidationIcon />}
                        </div>
                        <input
                            type="text"
                            className={`cp-input ${showError('title', title) && 'cp-input-error'}`}
                            placeholder="Enter your post title..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onBlur={() => handleBlur('title')}
                        />
                    </div>

                    {/* Tags & Type Container */}
                    <div ref={detailsRef} className="cp-card !scroll-mt-[100px]">
                        <div className="cp-inner-section">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <label className="font-bold text-lg">Tags</label>
                                    {showError('tags', tags) && <ValidationIcon />}
                                </div>
                                <input
                                    type="text"
                                    className={`cp-input-white ${showError('tags', tags) && 'cp-input-error'}`}
                                    placeholder="Add tags..."
                                    value={tags}
                                    onChange={(e) => setTags(e.target.value)}
                                    onBlur={() => handleBlur('tags')}
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <label className="font-bold text-lg">Type</label>
                                    {showError('type', type) && <ValidationIcon />}
                                </div>
                                <input
                                    type="text"
                                    className={`cp-input-white ${showError('type', type) && 'cp-input-error'}`}
                                    placeholder="Enter type..."
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    onBlur={() => handleBlur('type')}
                                />
                            </div>

                            <div className="relative pt-6">
                                <div className="space-y-4">
                                    <label className="font-bold text-lg text-gray-700">Category Select</label>
                                    <select
                                        className="cp-select"
                                        value={category}
                                        onChange={(e) => {
                                            const newCat = e.target.value;
                                            setCategory(newCat);
                                            // Clear subCategory if it doesn't belong to the new category
                                            if (newCat && subCategory && !dropdownData[newCat].includes(subCategory)) {
                                                setSubCategory('');
                                            }
                                        }}
                                    >
                                        <option value="">Select Category...</option>
                                        <option value="Fruit">Fruit</option>
                                        <option value="Country">Country</option>
                                    </select>
                                </div>

                                <div className="flex justify-center py-4">
                                    <div className="w-1 h-8 bg-gray-300 rounded-full relative">
                                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 border-[6px] border-transparent border-t-gray-300"></div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="font-bold text-lg text-gray-400 italic">Selection Items</label>
                                    <select
                                        className="cp-select"
                                        value={subCategory}
                                        onChange={(e) => {
                                            const newSub = e.target.value;
                                            setSubCategory(newSub);
                                            if (newSub) {
                                                // Automatically find and set the category
                                                for (const [cat, items] of Object.entries(dropdownData)) {
                                                    if (items.includes(newSub)) {
                                                        setCategory(cat);
                                                        break;
                                                    }
                                                }
                                            }
                                        }}
                                    >
                                        <option value="">{category ? `Select ${category}...` : 'Select Item...'}</option>
                                        {category
                                            ? dropdownData[category].map(item => <option key={item} value={item}>{item}</option>)
                                            : Object.values(dropdownData).flat().map(item => <option key={item} value={item}>{item}</option>)
                                        }
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* File Upload Section */}
                    <div ref={uploadRef} className="cp-card min-h-[400px] !scroll-mt-[100px]">
                        <div className="space-y-2">
                            <label className="font-bold text-xl tracking-tight">Media Upload</label>
                            <p className="text-gray-400 text-sm">Add featured images or files to your post</p>
                        </div>

                        <div className="cp-upload-box">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-2xl border border-gray-100">
                                📁
                            </div>
                            <div className="space-y-1">
                                <p className="font-bold text-lg text-gray-700">{selectedFile ? selectedFile.name : 'Choose a file or drag it here'}</p>
                                <p className="text-gray-400 text-sm">JPEG, PNG, PDF up to 10MB</p>
                            </div>
                            <input
                                type="file"
                                id="file-upload"
                                className="hidden"
                                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                            />
                            <label
                                htmlFor="file-upload"
                                className="mt-4 px-8 py-3 bg-white text-gray-800 border-2 border-gray-200 rounded-xl font-bold cursor-pointer hover:border-black hover:bg-gray-50 transition-all shadow-sm active:scale-95"
                            >
                                Browse Files
                            </label>
                        </div>
                    </div>
                </div>

                {/* Right Action Sidebar (Sticky) */}
                <div className="cp-sidebar !top-[100px] mt-[38px]">
                    <button
                        onClick={handlePublish}
                        className="cp-btn-publish"
                    >
                        Publish
                    </button>
                    <button className="cp-btn-secondary">
                        Save Draft
                    </button>
                    <button
                        onClick={() => navigate('/home')}
                        className="cp-btn-danger"
                    >
                        Cancel
                    </button>
                </div>

            </div>
        </div>
    );
}
