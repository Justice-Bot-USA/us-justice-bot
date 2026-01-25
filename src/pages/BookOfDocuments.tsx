import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Search, 
  FileText, 
  Image, 
  Video, 
  Music, 
  File, 
  Download, 
  Eye, 
  Trash2, 
  FolderOpen,
  Calendar,
  Filter,
  SortAsc,
  SortDesc,
  Upload,
  Briefcase,
  Cloud,
  ArrowLeft,
  FileDown,
  Loader2,
  Scale
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { generateBookOfDocumentsPDF, downloadPDF } from '@/lib/pdfGenerator';

const BookOfDocuments = () => {
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [fileTypeFilter, setFileTypeFilter] = useState<string>('all');
  const [bucketFilter, setBucketFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [courtReadyMode, setCourtReadyMode] = useState(false); // Chronological oldest-first for court filing

  // Fetch all case files for the user
  const { data: caseFiles, isLoading, refetch } = useQuery({
    queryKey: ['book-of-documents', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('case_files')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user
  });

  // Fetch case merit scores to organize files by case
  const { data: cases } = useQuery({
    queryKey: ['user-cases', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('case_merit_scores')
        .select('id, case_title, legal_area, state, session_id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user
  });

  // Group files by case_id (primary) or session_id (fallback)
  const groupedFiles = useMemo(() => {
    if (!caseFiles) return {};
    
    const groups: Record<string, typeof caseFiles> = {
      'Uncategorized': []
    };

    caseFiles.forEach(file => {
      // First try to match by case_id (new direct linking)
      if ((file as any).case_id && cases) {
        const matchingCase = cases.find(c => c.id === (file as any).case_id);
        if (matchingCase) {
          const key = matchingCase.case_title;
          if (!groups[key]) groups[key] = [];
          groups[key].push(file);
          return;
        }
      }
      
      // Fallback to session_id matching (legacy)
      if (file.session_id && cases) {
        const matchingCase = cases.find(c => c.session_id === file.session_id);
        if (matchingCase) {
          const key = matchingCase.case_title;
          if (!groups[key]) groups[key] = [];
          groups[key].push(file);
          return;
        }
      }
      
      // No match - put in uncategorized
      groups['Uncategorized'].push(file);
    });

    // Remove empty groups
    Object.keys(groups).forEach(key => {
      if (groups[key].length === 0) delete groups[key];
    });

    return groups;
  }, [caseFiles, cases]);

  // Filter and sort files
  const filteredFiles = useMemo(() => {
    if (!caseFiles) return [];
    
    let filtered = [...caseFiles];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(file => 
        file.file_name.toLowerCase().includes(query) ||
        file.description?.toLowerCase().includes(query) ||
        file.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // File type filter
    if (fileTypeFilter !== 'all') {
      filtered = filtered.filter(file => {
        if (fileTypeFilter === 'image') return file.file_type.startsWith('image/');
        if (fileTypeFilter === 'document') return file.file_type.includes('pdf') || file.file_type.includes('document');
        if (fileTypeFilter === 'video') return file.file_type.startsWith('video/');
        if (fileTypeFilter === 'audio') return file.file_type.startsWith('audio/');
        if (fileTypeFilter === 'cloud') return file.file_type.startsWith('cloud/');
        return true;
      });
    }

    // Bucket filter
    if (bucketFilter !== 'all') {
      filtered = filtered.filter(file => file.bucket_name === bucketFilter);
    }

    // Sorting - court-ready mode overrides to chronological (oldest first)
    if (courtReadyMode) {
      filtered.sort((a, b) => {
        const dateA = new Date(a.created_at || '').getTime();
        const dateB = new Date(b.created_at || '').getTime();
        return dateA - dateB; // Oldest first for court filing
      });
    } else {
      filtered.sort((a, b) => {
        let comparison = 0;
        if (sortBy === 'date') {
          comparison = new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime();
        } else if (sortBy === 'name') {
          comparison = a.file_name.localeCompare(b.file_name);
        } else if (sortBy === 'size') {
          comparison = a.file_size - b.file_size;
        }
        return sortOrder === 'asc' ? comparison : -comparison;
      });
    }

    return filtered;
  }, [caseFiles, searchQuery, fileTypeFilter, bucketFilter, sortBy, sortOrder, courtReadyMode]);

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-5 w-5 text-green-500" />;
    if (type.startsWith('video/')) return <Video className="h-5 w-5 text-purple-500" />;
    if (type.startsWith('audio/')) return <Music className="h-5 w-5 text-pink-500" />;
    if (type.includes('pdf') || type.includes('document')) return <FileText className="h-5 w-5 text-red-500" />;
    if (type.startsWith('cloud/')) return <Cloud className="h-5 w-5 text-blue-500" />;
    return <File className="h-5 w-5 text-muted-foreground" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getSignedUrl = async (file: typeof caseFiles[0]) => {
    if (file.file_type.startsWith('cloud/')) {
      return file.file_path;
    }
    const { data, error } = await supabase.storage
      .from(file.bucket_name)
      .createSignedUrl(file.file_path, 3600);
    if (error) {
      console.error('Error getting signed URL:', error);
      return null;
    }
    return data.signedUrl;
  };

  const handleDelete = async (fileId: string, filePath: string, bucketName: string) => {
    try {
      // Delete from storage (only if not a cloud link)
      if (!filePath.startsWith('http')) {
        await supabase.storage.from(bucketName).remove([filePath]);
      }
      
      // Delete from database
      const { error } = await supabase.from('case_files').delete().eq('id', fileId);
      if (error) throw error;
      
      toast.success('File deleted successfully');
      refetch();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete file');
    }
  };

  const handleDownloadPDF = async () => {
    if (!caseFiles?.length) {
      toast.error('No documents to export');
      return;
    }

    setIsGeneratingPDF(true);
    try {
      // Sort files chronologically (oldest first) for court-ready PDF
      const sortedFiles = [...caseFiles].sort((a, b) => {
        const dateA = new Date(a.created_at || '').getTime();
        const dateB = new Date(b.created_at || '').getTime();
        return dateA - dateB; // Oldest first
      });

      // Get case info if files are associated with a case
      const firstCaseFile = sortedFiles.find((f: any) => f.case_id);
      let caseInfo = undefined;
      
      if (firstCaseFile && cases?.length) {
        const matchingCase = cases.find(c => c.id === (firstCaseFile as any).case_id);
        if (matchingCase) {
          caseInfo = {
            case_title: matchingCase.case_title,
            legal_area: matchingCase.legal_area,
            state: matchingCase.state,
            county: undefined
          };
        }
      }

      const doc = generateBookOfDocumentsPDF(sortedFiles, caseInfo);
      const filename = caseInfo 
        ? `Book_of_Documents_${caseInfo.case_title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`
        : `Book_of_Documents_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
      
      downloadPDF(doc, filename);
      toast.success('Court-ready Book of Documents downloaded!');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const FileCard = ({ file }: { file: typeof caseFiles[0] }) => {
    const [fileUrl, setFileUrl] = React.useState<string | null>(null);
    
    React.useEffect(() => {
      getSignedUrl(file).then(setFileUrl);
    }, [file]);
    
    const handleView = async () => {
      const url = fileUrl || await getSignedUrl(file);
      if (url) window.open(url, '_blank');
    };
    
    const handleDownload = async () => {
      const url = fileUrl || await getSignedUrl(file);
      if (url) {
        const a = document.createElement('a');
        a.href = url;
        a.download = file.file_name;
        a.click();
      }
    };
    
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-muted rounded-lg">
              {getFileIcon(file.file_type)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium truncate">{file.file_name}</h4>
              <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-muted-foreground">
                <span>{formatFileSize(file.file_size)}</span>
                <span>•</span>
                <span>{format(new Date(file.created_at || ''), 'MMM d, yyyy')}</span>
              </div>
              {file.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{file.description}</p>
              )}
              {file.tags && file.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {file.tags.map((tag, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={handleView} title="View">
                <Eye className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleDownload}
                title="Download"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-destructive hover:text-destructive"
                onClick={() => handleDelete(file.id, file.file_path, file.bucket_name)}
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header language={language} onLanguageChange={setLanguage} />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Sign In Required</CardTitle>
              <CardDescription>Please sign in to view your documents.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/auth">Sign In</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header language={language} onLanguageChange={setLanguage} />
      
      <main id="main-content" className="flex-1 container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/my-cases">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Cases
              </Link>
            </Button>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <FolderOpen className="h-8 w-8 text-primary" />
                Book of Documents
              </h1>
              <p className="text-muted-foreground mt-1">
                All your uploaded evidence and documents in one place
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant={courtReadyMode ? "default" : "outline"}
                onClick={() => {
                  setCourtReadyMode(!courtReadyMode);
                  if (!courtReadyMode) {
                    toast.success('Court-ready mode: Documents sorted oldest → newest');
                  }
                }}
                className={courtReadyMode ? "bg-green-600 hover:bg-green-700" : ""}
              >
                <Scale className="h-4 w-4 mr-2" />
                {courtReadyMode ? "Court-Ready ✓" : "Court-Ready Order"}
              </Button>
              <Button 
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF || !caseFiles?.length}
                className="bg-primary"
              >
                {isGeneratingPDF ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <FileDown className="h-4 w-4 mr-2" />
                )}
                Download PDF
              </Button>
              <Button asChild variant="outline">
                <Link to="/case-analysis">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload New Evidence
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-primary">{caseFiles?.length || 0}</p>
              <p className="text-sm text-muted-foreground">Total Files</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-green-600">
                {caseFiles?.filter(f => f.file_type.startsWith('image/')).length || 0}
              </p>
              <p className="text-sm text-muted-foreground">Images</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-red-600">
                {caseFiles?.filter(f => f.file_type.includes('pdf') || f.file_type.includes('document')).length || 0}
              </p>
              <p className="text-sm text-muted-foreground">Documents</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-blue-600">
                {Object.keys(groupedFiles).length}
              </p>
              <p className="text-sm text-muted-foreground">Categories</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search files by name, description, or tags..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Select value={fileTypeFilter} onValueChange={setFileTypeFilter}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="File Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="image">Images</SelectItem>
                    <SelectItem value="document">Documents</SelectItem>
                    <SelectItem value="video">Videos</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                    <SelectItem value="cloud">Cloud Links</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={bucketFilter} onValueChange={setBucketFilter}>
                  <SelectTrigger className="w-[160px]">
                    <FolderOpen className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="evidence-files">Evidence</SelectItem>
                    <SelectItem value="case-documents">Case Docs</SelectItem>
                    <SelectItem value="user-uploads">Uploads</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as 'date' | 'name' | 'size')}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="size">Size</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs defaultValue="by-case" className="space-y-4">
          <TabsList>
            <TabsTrigger value="by-case" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              By Case
            </TabsTrigger>
            <TabsTrigger value="all-files" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              All Files
            </TabsTrigger>
            <TabsTrigger value="recent" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Recent
            </TabsTrigger>
          </TabsList>

          <TabsContent value="by-case" className="space-y-4">
            {isLoading ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">Loading documents...</p>
                </CardContent>
              </Card>
            ) : Object.keys(groupedFiles).length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Documents Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start by uploading evidence for your legal cases.
                  </p>
                  <Button asChild>
                    <Link to="/case-analysis">Upload Evidence</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Accordion type="multiple" defaultValue={Object.keys(groupedFiles)} className="space-y-2">
                {Object.entries(groupedFiles).map(([caseName, files]) => (
                  <AccordionItem key={caseName} value={caseName} className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3">
                        <Briefcase className="h-5 w-5 text-primary" />
                        <span className="font-medium">{caseName}</span>
                        <Badge variant="secondary">{files.length} files</Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 pt-2">
                        {files.map(file => (
                          <FileCard key={file.id} file={file} />
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </TabsContent>

          <TabsContent value="all-files" className="space-y-3">
            {isLoading ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">Loading documents...</p>
                </CardContent>
              </Card>
            ) : filteredFiles.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Files Found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery ? 'Try adjusting your search or filters.' : 'Upload some evidence to get started.'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredFiles.map(file => (
                <FileCard key={file.id} file={file} />
              ))
            )}
          </TabsContent>

          <TabsContent value="recent" className="space-y-3">
            {isLoading ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">Loading documents...</p>
                </CardContent>
              </Card>
            ) : (
              <>
                {caseFiles?.slice(0, 10).map(file => (
                  <FileCard key={file.id} file={file} />
                ))}
                {(!caseFiles || caseFiles.length === 0) && (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Recent Files</h3>
                      <p className="text-muted-foreground">Your recently uploaded files will appear here.</p>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default BookOfDocuments;
