import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Image, Link, MapPin } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Write() {
  const { user } = useUser();
  const [searchParams] = useSearchParams();
  const [title, setTitle] = React.useState('');
  const [location, setLocation] = React.useState(searchParams.get('location') || '');
  const [tags, setTags] = React.useState('');
  const [coverImage, setCoverImage] = React.useState(searchParams.get('image') || '');
  const [publishing, setPublishing] = React.useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg mx-auto focus:outline-none min-h-[300px]',
      },
    },
  });

  const handlePublish = async () => {
    if (!title || !location || !editor?.getText()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setPublishing(true);
    try {
      const postData = {
        title,
        content: editor?.getHTML(),
        location,
        tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
        imageUrl: coverImage,
        authorId: user?.id,
        authorName: user?.fullName,
      };

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });

      if (!response.ok) throw new Error('Failed to publish post');

      toast.success('Post published successfully!');
      window.location.href = '/';
    } catch (error) {
      toast.error('Failed to publish post');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Write Your Story</h1>

      <div className="space-y-6">
        <div>
          <input
            type="text"
            placeholder="Title of your story"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field text-2xl font-bold"
          />
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <MapPin className="h-5 w-5 text-gray-400" />
              <label className="text-sm font-medium text-gray-700">Location</label>
            </div>
            <input
              type="text"
              placeholder="Where did this story take place?"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Link className="h-5 w-5 text-gray-400" />
              <label className="text-sm font-medium text-gray-700">Tags</label>
            </div>
            <input
              type="text"
              placeholder="Add tags separated by commas"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Image className="h-5 w-5 text-gray-400" />
            <label className="text-sm font-medium text-gray-700">Cover Image URL</label>
          </div>
          <input
            type="text"
            placeholder="Add a cover image URL"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            className="input-field"
          />
          {coverImage && (
            <div className="mt-2 relative h-48 rounded-lg overflow-hidden">
              <img
                src={coverImage}
                alt="Cover preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        <div className="bg-white border rounded-lg p-4">
          <EditorContent editor={editor} />
        </div>

        <div className="flex justify-end space-x-4">
          <button className="btn-secondary">Save Draft</button>
          <button
            onClick={handlePublish}
            disabled={publishing}
            className="btn-primary"
          >
            {publishing ? 'Publishing...' : 'Publish Story'}
          </button>
        </div>
      </div>
    </div>
  );
}