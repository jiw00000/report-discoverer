-- Create ResourceDB table for managing student resources
CREATE TABLE public.resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  link TEXT,
  major TEXT,
  type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Resources are viewable by everyone" 
ON public.resources 
FOR SELECT 
USING (true);

-- Create policy for authenticated users to insert
CREATE POLICY "Authenticated users can insert resources" 
ON public.resources 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Create policy for authenticated users to update
CREATE POLICY "Authenticated users can update resources" 
ON public.resources 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Create policy for authenticated users to delete
CREATE POLICY "Authenticated users can delete resources" 
ON public.resources 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_resources_updated_at
BEFORE UPDATE ON public.resources
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better search performance
CREATE INDEX idx_resources_major ON public.resources(major);
CREATE INDEX idx_resources_type ON public.resources(type);
CREATE INDEX idx_resources_title ON public.resources USING gin(to_tsvector('english', title));
CREATE INDEX idx_resources_description ON public.resources USING gin(to_tsvector('english', description));