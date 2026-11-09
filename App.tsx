import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator, Keyboard, Platform, Pressable, SafeAreaView, ScrollView,
  StatusBar as NativeStatusBar, StyleSheet, Text, TextInput, View, useWindowDimensions,
} from 'react-native';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import type { Course, Screen, Progress, ReviewCard } from './src/types/course';
import { isCourseContent, readProgress } from './src/types/course';
import { dayKey, previousDay, scheduleReview, currentStreak } from './src/lib/learning';
import { Icon } from './src/components/Icon';
import { Tutor } from './src/components/Tutor';
import { Review } from './src/components/Review';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STARTER_COURSES, INTERESTS } from './data/courses';

const C = {
  bg: '#FAF9F6', ink: '#1D302D', muted: '#77817B', line: '#E6EAE1', white: '#FFFFFF',
  green: '#D7F098', darkGreen: '#284A35', purple: '#D65B35', softPurple: '#F9E9DF',
  softGreen: '#E9F3D3', yellow: '#FFF1C3', orange: '#EF8B53', danger: '#A84848',
};
const STORE_KEY = 'mam-viet-learning-v1';
const dateKey = dayKey;
type CopyProps = { children: React.ReactNode; style?: StyleProp<TextStyle>; color?: string; size?: number; weight?: TextStyle['fontWeight'] };
type ButtonProps = { children: React.ReactNode; onPress: () => void; variant?: 'primary' | 'green' | 'secondary' | 'ghost' | 'purple'; disabled?: boolean; style?: StyleProp<ViewStyle>; textStyle?: StyleProp<TextStyle>; icon?: string };

function Label({ children, style, color = C.muted, size = 12, weight = '700' }: CopyProps) {
  return <Text style={[{ fontSize: size, color, fontWeight: weight, letterSpacing: 0.3 }, style]}>{children}</Text>;
}
function Title({ children, style, size = 26 }: CopyProps) {
  return <Text style={[{ color: C.ink, fontSize: size, lineHeight: size * 1.22, fontWeight: '800', letterSpacing: -0.7 }, style]}>{children}</Text>;
}
function Body({ children, style, size = 14, color = C.muted }: CopyProps) {
  return <Text style={[{ color, fontSize: size, lineHeight: size * 1.55 }, style]}>{children}</Text>;
}
function Button({ children, onPress, variant = 'primary', disabled = false, style, textStyle, icon }: ButtonProps) {
  const bgs = { primary: C.ink, green: C.green, secondary: C.white, ghost: 'transparent', purple: C.purple };
  const fgs = { primary: '#FFF', green: C.ink, secondary: C.ink, ghost: C.ink, purple: '#FFF' };
  return (
    <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress}
      style={({ pressed }) => [styles.button, { backgroundColor: bgs[variant], opacity: disabled ? 0.45 : pressed ? 0.84 : 1 }, variant === 'secondary' && { borderWidth: 1, borderColor: C.line }, style]}>
      <Text style={[{ color: fgs[variant], fontSize: 14, fontWeight: '800', textAlign: 'center' }, textStyle]}>{children}{icon ? `  ${icon}` : ''}</Text>
    </Pressable>
  );
}
function Chip({ title, onPress, active = false }: { title: string; onPress: () => void; active?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ selected: active }} onPress={onPress} style={[styles.chip, active && { backgroundColor: C.ink, borderColor: C.ink }]}>
    <Text style={{ fontSize: 12, fontWeight: '700', color: active ? '#FFF' : C.ink }}>{title}</Text>
  </Pressable>;
}
function Bar({ value, color = C.darkGreen, track = '#E8EDE3', height = 7 }: { value: number; color?: string; track?: string; height?: number }) {
  return <View style={{ height, borderRadius: 30, overflow: 'hidden', backgroundColor: track }}>
    <View style={{ height: '100%', width: `${Math.min(100, Math.max(0, value))}%`, backgroundColor: color, borderRadius: 30 }} />
  </View>;
}
function Header({ onProfile, streak }: { onProfile: () => void; streak: number }) {
  return <View style={styles.header}>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <View style={styles.logo}><Icon name="sprout" size={24}/></View>
      <Text style={{ color: C.ink, fontSize: 25, fontWeight: '900', letterSpacing: -1.4 }}>mầm<Text style={{ color: C.purple }}>.</Text></Text>
    </View>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <View style={styles.streak}><Text style={{ fontSize: 13 }}>🔥</Text><Text style={{ fontSize: 13, fontWeight: '800', color: C.ink }}>{streak}</Text></View>
      <Pressable accessibilityRole="button" onPress={onProfile} accessibilityLabel="Hồ sơ của tôi" style={styles.avatar}><Text style={{ fontSize: 17 }}>☺️</Text></Pressable>
    </View>
  </View>;
}
function SectionTitle({ title, sideText, onSidePress }: { title: string; sideText?: string; onSidePress?: () => void }) {
  return <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 13 }}>
    <Title size={20}>{title}</Title>
    {sideText ? <Pressable accessibilityRole="button" onPress={onSidePress}><Text style={{ color: C.purple, fontWeight: '800', fontSize: 12 }}>{sideText}  →</Text></Pressable> : null}
  </View>;
}
function CourseCard({ course, progress, onPress, small = false }: { course: Course; progress: number; onPress: () => void; small?: boolean }) {
  const percent = Math.round((progress / course.lessons.length) * 100);
  if (small) {
    return <Pressable accessibilityRole="button" onPress={onPress} style={[styles.courseMini, { backgroundColor: course.color }]}>
      <View style={styles.miniEmoji}><Text style={{ fontSize: 31 }}>{course.emoji}</Text></View>
      <Label color={course.accent} style={{ marginTop: 8 }}>{course.category.toUpperCase()}</Label>
      <Text numberOfLines={2} style={[styles.miniTitle, { color: C.ink }]}>{course.title}</Text>
      <Text style={{ marginTop: 4, color: course.accent, fontSize: 12, fontWeight: '600' }}>{course.lessons.length} bài học · {course.level}</Text>
    </Pressable>;
  }
  return <Pressable accessibilityRole="button" onPress={onPress} style={styles.courseRow}>
    <View style={[styles.courseRowIcon, { backgroundColor: course.color }]}><Text style={{ fontSize: 34 }}>{course.emoji}</Text></View>
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <Label size={10} color={course.accent}>{course.category.toUpperCase()} {course.source === 'ai' ? '· AI' : ''}</Label>
      <Text numberOfLines={1} style={{ color: C.ink, fontSize: 15, fontWeight: '800', marginTop: 4 }}>{course.title}</Text>
      <Text numberOfLines={1} style={{ color: C.muted, fontSize: 11, marginVertical: 5 }}>{course.subtitle}</Text>
      <Bar value={percent} color={course.accent} height={5} />
    </View>
    <Text style={{ marginLeft: 4, color: C.muted, fontSize: 18 }}>›</Text>
  </Pressable>;
}
function BottomNav({ current, navigate }: { current: Screen; navigate: (screen: Screen) => void }) {
  const tabs = [ ['home', 'home', 'Hôm nay'], ['explore', 'explore', 'Khám phá'], ['review', 'review', 'Ôn tập'], ['profile', 'profile', 'Cá nhân'] ] as const;
  return <View style={styles.nav}>
    {tabs.map(([id, icon, label]) => <Pressable key={id} onPress={() => navigate(id)} accessibilityRole="tab" accessibilityState={{ selected: current === id }} style={styles.navItem}>
      <View style={[styles.navGlyph, current === id && { backgroundColor: C.softGreen }]}><Icon name={icon} color={current === id ? C.ink : '#8A968E'} /></View>
      <Text style={{ fontSize: 10, fontWeight: current === id ? '800' : '600', color: current === id ? C.ink : '#8A968E', marginTop: 2 }}>{label}</Text>
    </Pressable>)}
  </View>;
}
function BackBar({ label = 'Quay lại', onBack, right }: { label?: string; onBack: () => void; right?: string }) {
  return <View style={styles.backBar}>
    <Pressable accessibilityRole="button" onPress={onBack} style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 6 }}>
      <Text style={{ color: C.ink, fontWeight: '900', fontSize: 24 }}>‹</Text><Text style={{ color: C.ink, fontWeight: '800', fontSize: 13 }}>{label}</Text>
    </Pressable>
    {right ? <Label color={C.ink}>{right}</Label> : null}
  </View>;
}

export default function App() {
  const { width, height } = useWindowDimensions();
  const desktop = Platform.OS === 'web' && width >= 900;
  const [screen, setScreen] = useState<Screen>('home');
  const [tab, setTab] = useState<Screen>('home');
  const [courseId, setCourseId] = useState('space');
  const [lessonIndex, setLessonIndex] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [completed, setCompleted] = useState<Progress['completed']>({});
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastStudy, setLastStudy] = useState('');
  const [customCourses, setCustomCourses] = useState<Course[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [category, setCategory] = useState('Tất cả');
  const [search, setSearch] = useState('');
  const [topic, setTopic] = useState('');
  const [goal, setGoal] = useState('');
  const [level, setLevel] = useState('Người mới');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [reviews, setReviews] = useState<Record<string, ReviewCard>>({});
  const [tutorOpen, setTutorOpen] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);
  const [confirmReset, setConfirmReset] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const courses = useMemo(() => [...customCourses, ...STARTER_COURSES], [customCourses]);
  const course = courses.find(item => item.id === courseId) || STARTER_COURSES[0];
  const activeLesson = course.lessons[lessonIndex] || course.lessons[0];
  const doneCount = Object.values(completed).filter(Boolean).length;
  const totalLessons = courses.reduce((sum, item) => sum + item.lessons.length, 0);
  const perCourse = (c: Course) => c.lessons.filter((_, i) => completed[`${c.id}:${i}`]).length;
  const go = (next: Screen) => { Keyboard.dismiss(); setTutorOpen(false); setScreen(next); setTab(['home','explore','stats','profile','review'].includes(next) ? next : tab); scrollRef.current?.scrollTo({ y: 0, animated: false }); };
  const openCourse = (c: Course) => { setCourseId(c.id); go('course'); };
  const startLesson = (index: number) => { setLessonIndex(index); setPageIndex(0); setAnswer(null); setChecked(false); go('lesson'); };
  const nextIncomplete = (c: Course) => Math.max(0, c.lessons.findIndex((_, i) => !completed[`${c.id}:${i}`]));
  const featured = courses.find(c => perCourse(c) > 0 && perCourse(c) < c.lessons.length) || courses[0];
  const onBack = () => { if (screen === 'quiz') go('lesson'); else if (screen === 'lesson' || screen === 'done') go('course'); else go('home'); };
  const isCorrect = answer === activeLesson.quiz.answer;

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORE_KEY);
        if (raw && mounted) {
          const p = readProgress(JSON.parse(raw));
          setReviews(p.reviews);
          setCompleted(p.completed || {}); setXp(p.xp || 0); setStreak(p.streak || 0);
          setLastStudy(p.lastStudy || ''); setCustomCourses(Array.isArray(p.customCourses) ? p.customCourses : []);
        }
      } catch (e) { console.warn('Could not load local progress:', e instanceof Error ? e.message : String(e)); }
      finally { if (mounted) setHydrated(true); }
    })();
    return () => { mounted = false; };
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORE_KEY, JSON.stringify({ completed, xp, streak, lastStudy, customCourses, reviews }))
      .catch(e => console.warn('Could not save local progress:', e.message));
  }, [hydrated, completed, xp, streak, lastStudy, customCourses, reviews]);

  const finish = () => {
    const key = `${course.id}:${lessonIndex}`;
    setEarnedXp(completed[key] ? 0 : 25);
    setReviews(old => ({...old, [key]: old[key] ?? scheduleReview(undefined, true)}));
    if (!completed[key]) {
      setCompleted(old => ({ ...old, [key]: true }));
      setXp(old => old + 25);
      const today = dateKey();
      if (lastStudy !== today) {
        const previous = previousDay();
        setStreak(old => lastStudy === previous ? old + 1 : 1);
        setLastStudy(today);
      }
    }
    go('done');
  };

  const createCourse = async () => {
    setCreateError('');
    const clean = topic.trim();
    if (clean.length < 3) { setCreateError('Hãy nhập một chủ đề dài ít nhất 3 ký tự nhé.'); return; }
    // Curated matches are available without any API key.
    const found = STARTER_COURSES.find(c => c.title.toLocaleLowerCase('vi').includes(clean.toLocaleLowerCase('vi')) || clean.toLocaleLowerCase('vi').includes(c.title.toLocaleLowerCase('vi')));
    if (found) { openCourse(found); return; }
    const url = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/$/, '');
    if (!url) { setCreateError('Chưa kết nối máy chủ AI. Bạn có thể học 5 khóa mẫu ngay, hoặc xem README để bật tính năng tạo khóa học bất kỳ.'); return; }
    setCreating(true);
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 55000);
      let response;
      try { response = await fetch(`${url}/api/course`, { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ topic:clean, goal:goal.trim(), level }), signal:controller.signal }); }
      finally { clearTimeout(timer); }
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || 'Máy chủ chưa sẵn sàng.');
      if (!isCourseContent(body.course)) throw new Error('Dữ liệu từ AI chưa hợp lệ.');
      const newCourse: Course = { ...body.course, id:`ai-${Date.now()}`, source:'ai', category:'Cá nhân hoá', color:'#E8E1FF', accent:'#6851A9', emoji:'✨', level };
      setCustomCourses(old => [newCourse, ...old]);
      setTopic(''); setGoal(''); openCourse(newCourse);
    } catch (e) { setCreateError(e instanceof Error ? (e.name === 'AbortError' ? 'Hết thời gian chờ AI. Hãy thử lại.' : e.message) : 'Không thể tạo khóa học.'); }
    finally { setCreating(false); }
  };

  if (!hydrated) return <View style={{flex:1,alignItems:'center',justifyContent:'center',backgroundColor:C.bg}}><ActivityIndicator color={C.darkGreen}/><Text style={{marginTop:12,color:C.ink}}>Mầm đang thức giấc...</Text></View>;

  const nav = ['home','explore','stats','profile','review'].includes(screen);
  const progressPercent = totalLessons ? Math.round(doneCount / totalLessons * 100) : 0;
  return <View style={[styles.outer, desktop && { padding: 18 }]}>
    <NativeStatusBar barStyle="dark-content" backgroundColor={C.bg} />
    {desktop ? <View style={styles.desktopCopy}>
      <View style={{ width: 50, height: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 16, backgroundColor: C.green }}><Text style={{ fontSize: 30 }}>🌱</Text></View>
      <Title size={38} style={{ marginTop: 22 }}>Kiến thức nở hoa,{"\n"}mỗi ngày một chút.</Title>
      <Body size={16} style={{ marginTop: 15, maxWidth: 320 }}>Nuôi trí tò mò bằng những bài học nhỏ. Khám phá, tự kiểm tra và nhớ lâu hơn mỗi ngày.</Body>
      <View style={{ marginTop: 28, backgroundColor:'#FFF', borderRadius: 14, padding: 14, alignSelf: 'flex-start', borderWidth:1, borderColor:C.line }}><Text style={{ color:C.ink, fontWeight:'700' }}>✦  Một chút tò mò, mỗi ngày</Text><Text style={{ color:C.muted, marginTop:5, fontSize:12 }}>Học ngắn · Hiểu sâu · Nhớ lâu</Text></View>
    </View> : null}
    <SafeAreaView style={[styles.phone, desktop && { width: 406, minWidth: 406, height: Math.min(850, height - 38), flexGrow: 0, flexShrink: 0, flexBasis: 'auto', borderRadius: 36, overflow:'hidden', borderWidth: 7, borderColor:'#26352F', shadowColor:'#000', shadowOpacity:0.2, shadowRadius:25, shadowOffset:{width:0,height:15}, elevation:18 }]}>
      {desktop ? <View style={styles.fakeStatus}><Text style={styles.statusText}>9:41</Text><View style={styles.island} /><Text style={styles.statusText}>▴  ◉  ▰</Text></View> : null}
      <View style={{ flex: 1 }}>
        {nav ? <Header onProfile={() => go('profile')} streak={currentStreak(streak, lastStudy)} /> : null}
        {!nav && !['done'].includes(screen) ? <BackBar onBack={onBack} right={screen === 'lesson' || screen === 'quiz' ? `${lessonIndex+1}/${course.lessons.length} bài học` : undefined} /> : null}
        <ScrollView key={screen} ref={scrollRef} style={{ flex: 1 }} keyboardShouldPersistTaps="handled" contentContainerStyle={[styles.scrollContent, ['lesson','quiz','done'].includes(screen) && { flexGrow:1 }]} showsVerticalScrollIndicator={false}>
          {screen === 'review' ? <Review courses={courses} completed={completed} reviews={reviews} onGrade={(key, remembered) => setReviews(old => ({...old, [key]: scheduleReview(old[key], remembered)}))} onExplore={() => go('explore')} /> : null}
          {screen === 'home' ? <>
            <View style={styles.welcome}><Label size={10} color={C.purple}>MỖI NGÀY, MỘT ĐIỀU MỚI</Label><Title size={32} style={{marginTop:10,letterSpacing:-1.2}}>Dành chút thời gian{ '\n' }cho sự tò mò.</Title><Body size={13} style={{marginTop:10}}>Một bài học nhỏ. Một góc nhìn mới.</Body></View>
            <Pressable accessibilityRole="button" onPress={() => { setCreateError(''); go('create'); }} style={styles.newHero}>
              <View style={styles.heroOrbit}><Text style={{fontSize:70,color:'#F9D8AC'}}>✳</Text></View><Label color="#D5E6BF" size={10}>BẮT ĐẦU TỪ MỘT CÂU HỎI</Label><Title size={26} style={{color:'#FFF',marginTop:14,maxWidth:230}}>Bạn muốn hiểu{ '\n' }điều gì hơn?</Title><Body color="#DAE2D7" size={12} style={{marginTop:10,maxWidth:215}}>Biến bất kỳ chủ đề nào thành lộ trình dành riêng cho bạn.</Body><View style={styles.newHeroButton}><Text style={{color:C.ink,fontWeight:'800',fontSize:13}}>Tạo khóa học</Text><Text style={{fontSize:19}}>↗</Text></View>
            </Pressable>
            <View style={styles.dailyGoal}><View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}><View><Label color={C.ink}>NHỊP HỌC HÔM NAY</Label><Body size={12} style={{marginTop:4}}>{lastStudy===dateKey()?'Bạn đã gieo thêm một mầm kiến thức.':'Chỉ 3 phút để bắt đầu một thói quen tốt.'}</Body></View><Text style={{fontSize:26}}>{lastStudy===dateKey()?'✓':'◷'}</Text></View><View style={{marginTop:12}}><Bar value={lastStudy===dateKey()?100:0} color={C.darkGreen} height={5}/></View></View>
            <SectionTitle title={perCourse(featured)>0?'Tiếp tục hành trình':'Bắt đầu khám phá'} sideText="Thư viện" onSidePress={() => go('explore')} />
            <Pressable accessibilityRole="button" onPress={() => openCourse(featured)} style={styles.featured}>
              <View style={{ flexDirection:'row', alignItems:'center', gap:13 }}><View style={[styles.featureIcon,{backgroundColor:featured.color}]}><Text style={{fontSize:34}}>{featured.emoji}</Text></View><View style={{flex:1}}><Label size={9} color={C.purple}>{featured.category.toUpperCase()} · 3 PHÚT / BÀI</Label><Text style={{fontSize:17,color:C.ink,fontWeight:'800',marginTop:5}}>{featured.title}</Text><Body size={11} style={{marginTop:4}}>{perCourse(featured)}/{featured.lessons.length} bài hoàn thành</Body></View><Text style={{fontSize:25,color:C.ink}}>↗</Text></View><View style={{marginTop:15}}><Bar value={perCourse(featured)/featured.lessons.length*100} color={C.darkGreen} height={4}/></View>
            </Pressable>
            <SectionTitle title="Theo dòng tò mò" sideText="Xem thêm" onSidePress={() => go('explore')} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:12,paddingBottom:3}}>{STARTER_COURSES.slice(1).map(c=><CourseCard key={c.id} course={c} progress={perCourse(c)} small onPress={()=>openCourse(c)}/>)}</ScrollView>
            <Pressable accessibilityRole="button" onPress={()=>go('review')} style={styles.reviewBanner}><Icon name="review" size={32}/><View style={{flex:1}}><Text style={{fontSize:16,fontWeight:'800',color:C.ink}}>Học rồi, nhớ lâu.</Text><Body size={12}>Ghé vườn kiến thức để ôn lại hôm nay.</Body></View><Text>↗</Text></Pressable>
          </> : null}
          {screen === 'explore' ? <>
            <Label style={{ marginTop: 10 }}>THẾ GIỚI CÒN NHIỀU ĐIỀU HAY</Label><Title style={{ marginTop:8 }}>Đi theo sự tò mò.</Title>
            <View style={styles.searchBox}><Text style={{fontSize:18,color:C.muted}}>⌕</Text><TextInput placeholder="Bạn muốn tìm hiểu điều gì?" placeholderTextColor="#8D9A92" value={search} onChangeText={setSearch} style={styles.searchInput} returnKeyType="search" /></View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap:7, paddingVertical:4, marginBottom:15 }}>
              {INTERESTS.map(item => <Chip key={item} title={item} active={category===item} onPress={() => setCategory(item)} />)}
            </ScrollView>
            <SectionTitle title="Chọn điều bạn muốn hiểu" />
            {courses.filter(c => (category==='Tất cả' || c.category===category) && (!search || `${c.title} ${c.subtitle} ${c.category}`.toLocaleLowerCase('vi').includes(search.toLocaleLowerCase('vi')))).map(c => <CourseCard key={c.id} course={c} progress={perCourse(c)} onPress={() => openCourse(c)} />)}
            {courses.filter(c => (category==='Tất cả' || c.category===category) && (!search || `${c.title} ${c.subtitle} ${c.category}`.toLocaleLowerCase('vi').includes(search.toLocaleLowerCase('vi')))).length===0 ? <View style={styles.empty}><Text style={{fontSize:38}}>🌱</Text><Title size={18} style={{marginTop:11}}>Chưa có trong thư viện</Title><Body style={{textAlign:'center',marginTop:6}}>Hãy thử một từ khóa khác hoặc tạo khóa học riêng bằng AI.</Body></View> : null}
            <Pressable onPress={() => { setTopic(search); setCreateError(''); go('create'); }} style={styles.createFooter}><Text style={{fontSize:28}}>✨</Text><View style={{flex:1}}><Text style={{color:C.ink,fontSize:14,fontWeight:'800'}}>Không thấy chủ đề bạn muốn?</Text><Body size={12}>Tạo lộ trình của riêng bạn</Body></View><Text style={{fontSize:22}}>›</Text></Pressable>
          </> : null}
          {screen === 'course' ? <>
            <View style={[styles.courseHero,{backgroundColor:course.color}]}><View><Label color={course.accent}>{course.category.toUpperCase()} · {course.level}</Label><Title size={27} style={{marginTop:10,maxWidth:250}}>{course.title}</Title><Body color={course.accent} size={13} style={{marginTop:8,maxWidth:260}}>{course.subtitle}</Body></View><Text style={{position:'absolute',right:12,bottom:4,fontSize:91}}>{course.emoji}</Text></View>
            <View style={styles.courseMeta}><View><Title size={20}>{perCourse(course)}/{course.lessons.length}</Title><Label>Bài hoàn thành</Label></View><View style={styles.verticalDivider} /><View><Title size={20}>{course.lessons.length * 3} phút</Title><Label>Thời lượng</Label></View><View style={styles.verticalDivider}/><View><Title size={20}>+25</Title><Label>XP mỗi bài</Label></View></View>
            <SectionTitle title="Lộ trình học" /><Body style={{marginBottom:18}}>Chỉ cần vài phút mỗi ngày. Mỗi bài gồm kiến thức dễ hiểu và một câu hỏi nhỏ để ghi nhớ.</Body>
            {course.lessons.map((l, i) => { const done=!!completed[`${course.id}:${i}`]; return <Pressable accessibilityRole="button" key={i} onPress={() => startLesson(i)} style={styles.lessonRow}><View style={[styles.lessonNumber,{backgroundColor:done?C.green:'#F0EEE8'}]}><Text style={{fontWeight:'900',color:C.ink,fontSize:14}}>{done?'✓':String(i+1).padStart(2,'0')}</Text></View><View style={{flex:1}}><Label size={10}>{`BÀI ${i+1} · ${l.minutes || 3} PHÚT`}</Label><Text style={{fontSize:15,fontWeight:'800',color:C.ink,marginTop:5}}>{l.title}</Text><Body size={12}>{l.subtitle}</Body></View><Text style={{color:done?'#4D8552':C.ink,fontSize:21}}>{done?'✓':'›'}</Text></Pressable>; })}
            <Button style={{ marginTop:22 }} variant="primary" onPress={() => startLesson(nextIncomplete(course))}>{perCourse(course)===course.lessons.length?'Ôn lại từ đầu':'Bắt đầu học'}  →</Button>
            {course.source==='ai' ? <Body size={11} style={{marginTop:12,textAlign:'center'}}>Nội dung do AI tạo; hãy kiểm chứng các thông tin quan trọng.</Body> : null}
          </> : null}
          {screen === 'lesson' ? <>
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:12}}><Label>BÀI {lessonIndex+1} · {activeLesson.title.toUpperCase()}</Label><Label color={C.purple}>{pageIndex+1}/{activeLesson.pages.length}</Label></View>
            <Bar value={(pageIndex+1)/activeLesson.pages.length*100} color={C.purple} height={6} />
            <View style={styles.lessonContent}><View style={[styles.lessonVisual,{backgroundColor:course.color}]}><Text style={{fontSize:100}}>{activeLesson.pages[pageIndex].emoji}</Text><View style={styles.sparkOne}><Text style={{fontSize:29}}>✦</Text></View><View style={styles.sparkTwo}><Text style={{fontSize:17}}>✳</Text></View></View>
              <Label style={{marginTop:24}} color={C.purple}>{activeLesson.pages[pageIndex].kicker}</Label><Title size={26} style={{marginTop:8}}>{activeLesson.pages[pageIndex].title}</Title><Body size={16} color="#41524B" style={{marginTop:14,lineHeight:25}}>{activeLesson.pages[pageIndex].body}</Body>
              <View style={styles.takeaway}><Text style={{fontSize:20}}>💡</Text><View style={{flex:1}}><Label color={C.darkGreen}>NHỚ NHÉ!</Label><Body size={13} color={C.ink} style={{marginTop:3}}>{activeLesson.pages[pageIndex].takeaway}</Body></View></View>
            </View>
            <Pressable accessibilityRole="button" onPress={() => setTutorOpen(true)} style={styles.tutorTrigger}><Icon name="chat" color={C.purple}/><View style={{flex:1}}><Text style={{color:C.ink,fontWeight:'700'}}>Chưa rõ? Hỏi Mầm nhé</Text><Body size={12}>Giải thích thêm, theo cách của bạn</Body></View><Text>↗</Text></Pressable>
            <View style={styles.lessonActions}>
              {pageIndex>0 ? <Button variant="secondary" onPress={() => setPageIndex(v => v-1)} style={{width:82}}>←</Button> : null}
              <Button style={{flex:1}} onPress={() => pageIndex < activeLesson.pages.length-1 ? setPageIndex(v=>v+1) : go('quiz')}>
                {pageIndex===activeLesson.pages.length-1?'Kiểm tra kiến thức  →':'Tiếp tục  →'}
              </Button>
            </View>
          </> : null}
          {screen === 'quiz' ? <>
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:14}}><Label>KIỂM TRA NHỎ</Label><Label color={C.purple}>+25 XP</Label></View>
            <Bar value={100} color={C.purple} /><View style={{marginTop:28,alignItems:'center'}}><View style={[styles.quizVisual,{backgroundColor:C.softPurple}]}><Text style={{fontSize:57}}>🧠</Text></View><Label style={{marginTop:18}} color={C.purple}>CHỈ 1 CÂU HỎI</Label><Title size={24} style={{textAlign:'center',marginTop:8}}>{activeLesson.quiz.question}</Title></View>
            <View style={{marginTop:26,gap:10}}>{activeLesson.quiz.choices.map((choice,i) => <Pressable accessibilityRole="button" accessibilityState={{selected:answer===i}} key={i} disabled={checked && isCorrect} onPress={() => {setAnswer(i);setChecked(false);}} style={[styles.option,{borderColor:answer===i?C.purple:C.line,backgroundColor:answer===i?'#F1ECFF':'#FFF'}]}><View style={[styles.optionLetter,{backgroundColor:answer===i?C.purple:'#F4F4F0'}]}><Text style={{color:answer===i?'#FFF':C.ink,fontWeight:'800',fontSize:12}}>{String.fromCharCode(65+i)}</Text></View><Text style={{flex:1,color:C.ink,fontWeight:'600',fontSize:14,lineHeight:21}}>{choice}</Text><Text style={{fontSize:17,color:answer===i?C.purple:'#CCD2CA'}}>{answer===i?'◉':'○'}</Text></Pressable>)}</View>
            {checked ? <View style={[styles.feedback,{backgroundColor:isCorrect?'#E7F6D6':'#FFF0EB'}]}><Text style={{fontSize:22}}>{isCorrect?'🎉':'💭'}</Text><View style={{flex:1}}><Text style={{color:C.ink,fontWeight:'800',fontSize:14}}>{isCorrect?'Chính xác! Giỏi lắm.':'Chưa đúng, thử lại nhé!'}</Text><Body size={12} color={C.ink}>{activeLesson.quiz.why}</Body></View></View> : null}
            <View style={{flex:1,minHeight:20}} />
            <Button disabled={answer===null} onPress={() => {if(checked && isCorrect) finish(); else if(checked) {setChecked(false);setAnswer(null);} else setChecked(true);}}>{checked?(isCorrect?'Hoàn thành bài học  →':'Thử lại  ↻'):'Kiểm tra đáp án  →'}</Button>
          </> : null}
          {screen === 'done' ? <View style={styles.doneWrap}><View style={styles.doneArt}><Text style={{fontSize:99}}>🏆</Text></View><Label color={C.purple} style={{marginTop:28}}>BÀI HỌC HOÀN THÀNH</Label><Title size={29} style={{textAlign:'center',marginTop:10}}>Một bước nhỏ,{ '\n' }một điều mới! ✨</Title><Body style={{textAlign:'center',marginTop:12}}>Bạn vừa hoàn thành “{activeLesson.title}”. Mỗi ngày chỉ cần một chút là đủ tạo nên khác biệt.</Body><View style={styles.xpAward}><Text style={{fontSize:25}}>⭐</Text><Title size={25}>{earnedXp ? `+${earnedXp} XP` : 'Đã ôn lại'}</Title></View><Button style={{marginTop:20,width:'100%'}} onPress={() => { const next=lessonIndex+1; if(next < course.lessons.length) startLesson(next); else go('course'); }}>{lessonIndex+1<course.lessons.length?'Học bài tiếp theo  →':'Xem lại lộ trình  →'}</Button><Button variant="ghost" style={{marginTop:7}} onPress={() => go('home')}>Về trang chủ</Button></View> : null}
          {screen === 'stats' ? <>
            <Label style={{marginTop:8}}>NHÌN LẠI HÀNH TRÌNH</Label><Title style={{marginTop:7}}>Bạn đang tiến bộ! 🌱</Title><View style={styles.statsHero}><View><Label color="#667C56">TỔNG ĐIỂM TÍCH LŨY</Label><Title size={43} style={{marginTop:8}}>{xp} <Text style={{fontSize:16}}>XP</Text></Title><Body color="#536A4C">Tiếp tục học để gieo thêm tri thức.</Body></View><Text style={{fontSize:66,position:'absolute',right:12,bottom:12}}>🌻</Text></View>
            <View style={{flexDirection:'row',gap:12,marginBottom:27}}><View style={styles.statTile}><Text style={{fontSize:27}}>🔥</Text><Title size={24} style={{marginTop:7}}>{currentStreak(streak, lastStudy)} ngày</Title><Label>Chuỗi học liên tục</Label></View><View style={styles.statTile}><Text style={{fontSize:27}}>📚</Text><Title size={24} style={{marginTop:7}}>{doneCount} bài</Title><Label>Đã hoàn thành</Label></View></View>
            <SectionTitle title="Tổng quan tiến độ" /><View style={styles.progressCard}><View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:12}}><Label color={C.ink}>Các bài học</Label><Text style={{color:C.purple,fontWeight:'800'}}>{progressPercent}%</Text></View><Bar value={progressPercent} color={C.purple} height={10}/><Body size={11} style={{marginTop:10}}>{doneCount} trên {totalLessons} bài học đã hoàn thành.</Body></View>
            <SectionTitle title="Lộ trình của bạn" />
            {courses.filter(c=>perCourse(c)>0).length===0 ? <View style={styles.empty}><Text style={{fontSize:35}}>🌟</Text><Body style={{textAlign:'center',marginTop:10}}>Chọn một khóa học và hoàn thành bài đầu tiên để xem tiến độ.</Body></View> : courses.filter(c=>perCourse(c)>0).map(c=><CourseCard key={c.id} course={c} progress={perCourse(c)} onPress={()=>openCourse(c)}/>)}
          </> : null}
          {screen === 'profile' ? <>
            <Label style={{marginTop:9}}>GÓC NHỎ CỦA BẠN</Label><Title style={{marginTop:7}}>Học theo nhịp của mình.</Title><View style={styles.profileCard}><View style={styles.profileAvatar}><Text style={{fontSize:44}}>☺️</Text></View><View style={{flex:1}}><Title size={19}>Người học tò mò</Title><Body size={12}>Mỗi ngày một điều thú vị</Body><View style={{flexDirection:'row',gap:8,marginTop:8}}><Label color={C.purple}>{xp} XP</Label><Label>·</Label><Label>{doneCount} bài học</Label></View></View></View>
            <Button variant="secondary" onPress={() => go('stats')}>Xem tiến độ học tập  ↗</Button><View style={{height:24}}/><SectionTitle title="Về Mầm" /><View style={styles.infoCard}><Text style={styles.infoEmoji}>🌱</Text><View style={{flex:1}}><Text style={styles.infoTitle}>Học bằng sự tò mò</Text><Body size={12}>Mỗi câu hỏi mở ra một hành trình. Khám phá những điều mới qua bài học ngắn bằng tiếng Việt.</Body></View></View>
            <View style={styles.infoCard}><Text style={styles.infoEmoji}>🔒</Text><View style={{flex:1}}><Text style={styles.infoTitle}>Lưu dữ liệu cục bộ</Text><Body size={12}>Tiến độ lưu trên máy. Chưa có đăng nhập hay đồng bộ cloud.</Body></View></View>
            <View style={styles.infoCard}><Text style={styles.infoEmoji}>✨</Text><View style={{flex:1}}><Text style={styles.infoTitle}>Tạo bài học bằng AI</Text><Body size={12}>Cần cấu hình API máy chủ và khóa API riêng. Bài học mẫu luôn dùng được offline sau khi cài app.</Body></View></View>
            <Button variant="secondary" style={{marginTop:18}} onPress={()=>setConfirmReset(true)}>Xóa dữ liệu dùng thử</Button>
            <Body size={11} style={{textAlign:'center',marginTop:18}}>Mầm · Phiên bản 0.2.0</Body>
          </> : null}
          {screen === 'create' ? <>
            <View style={[styles.createVisual,{backgroundColor:C.softPurple}]}><Text style={{fontSize:64}}>✨</Text><Text style={{fontSize:55}}>📚</Text></View>
            <Label style={{marginTop:24}} color={C.purple}>LỘ TRÌNH DÀNH RIÊNG CHO BẠN</Label><Title size={27} style={{marginTop:8}}>Bạn tò mò về{ '\n' }điều gì hôm nay?</Title><Body style={{marginTop:9,marginBottom:24}}>Chọn một chủ đề. Mầm sẽ giúp chia kiến thức thành những bài học ngắn và dễ hiểu.</Body>
            <Text style={styles.formLabel}>Mình muốn tìm hiểu về...</Text>
            <TextInput value={topic} onChangeText={setTopic} placeholder="VD: Hiệu ứng cánh bướm, lịch sử Việt Nam..." placeholderTextColor="#9AA49B" autoCapitalize="sentences" maxLength={80} style={styles.input} />
            <Text style={[styles.formLabel,{marginTop:18}]}>Mục tiêu học tập (tùy chọn)</Text>
            <TextInput value={goal} onChangeText={setGoal} placeholder="VD: Hiểu khái niệm cơ bản" placeholderTextColor="#9AA49B" maxLength={160} style={styles.input} />
            <Text style={[styles.formLabel,{marginTop:21}]}>Trình độ hiện tại của bạn</Text>
            <View style={{flexDirection:'row',gap:8,flexWrap:'wrap',marginTop:10}}>{['Người mới', 'Đã biết một chút', 'Nâng cao'].map(item=><Chip key={item} title={item} active={level===item} onPress={()=>setLevel(item)}/>)}</View>
            {createError ? <View style={styles.errorPanel}><Text style={{fontSize:16}}>💬</Text><Body color={C.danger} size={12} style={{flex:1}}>{createError}</Body></View> : null}
            <View style={{marginTop:26}}><Button disabled={creating} onPress={createCourse}>{creating?'AI đang xây lộ trình...':'Tạo lộ trình của mình  ✨'}</Button>{creating?<ActivityIndicator style={{marginTop:16}} color={C.purple}/>:null}</View>
            <Body size={11} style={{marginTop:15,textAlign:'center'}}>Bạn có thể học ngay 5 chủ đề mẫu mà không cần AI.</Body>
            <Pressable onPress={()=>go('explore')} style={{padding:13,alignItems:'center'}}><Text style={{color:C.purple,fontWeight:'800'}}>Xem khóa học mẫu  →</Text></Pressable>
          </> : null}
        </ScrollView>
        {nav ? <BottomNav current={tab} navigate={go} /> : null}
        {desktop ? <View style={styles.homeIndicator}><View style={{width:112,height:4,borderRadius:10,backgroundColor:'#27372F'}}/></View> : null}
      </View>
      {tutorOpen ? <Tutor lesson={activeLesson} courseTitle={course.title} onClose={() => setTutorOpen(false)} /> : null}
      {confirmReset ? <View style={styles.overlay}><View style={styles.dialog}><Text style={{fontSize:35}}>🧹</Text><Title size={19} style={{marginTop:12}}>Xóa tiến độ học?</Title><Body style={{marginTop:8,marginBottom:17}}>Các bài hoàn thành, XP và khóa học AI đã tạo sẽ bị xóa trên thiết bị này.</Body><Button onPress={()=>{setCompleted({});setXp(0);setStreak(0);setLastStudy('');setCustomCourses([]);setReviews({});setConfirmReset(false);go('home');}}>Xóa dữ liệu</Button><Button variant="ghost" onPress={()=>setConfirmReset(false)}>Giữ lại</Button></View></View>:null}
    </SafeAreaView>
  </View>;
}

const styles = StyleSheet.create({
  welcome:{paddingTop:17,paddingBottom:23},
  newHero:{backgroundColor:'#244638',borderRadius:25,padding:23,minHeight:254,overflow:'hidden'},
  heroOrbit:{position:'absolute',right:-25,top:30,width:153,height:153,borderWidth:1,borderColor:'#54755C',borderRadius:90,alignItems:'center',justifyContent:'center',transform:[{rotate:'15deg'}]},
  newHeroButton:{marginTop:21,backgroundColor:'#E3EFCD',paddingHorizontal:17,paddingVertical:12,borderRadius:13,flexDirection:'row',gap:21,alignItems:'center',alignSelf:'flex-start'},
  dailyGoal:{paddingVertical:22,marginBottom:7},
  reviewBanner:{backgroundColor:'#EAF0DC',borderRadius:20,padding:18,marginTop:24,flexDirection:'row',gap:14,alignItems:'center'},
  tutorTrigger:{padding:17,borderWidth:1,borderColor:C.line,borderRadius:16,marginTop:22,flexDirection:'row',gap:12,alignItems:'center',backgroundColor:'#FFF'},
  outer:{ flex:1, backgroundColor:'#ECEDE5', flexDirection:'row', alignItems:'center', justifyContent:'center' },
  phone:{ flex:1, backgroundColor:C.bg, maxWidth:480, width:'100%', overflow:'hidden' },
  desktopCopy:{ width:390, paddingHorizontal:25, marginRight:25 },
  fakeStatus:{height:38,flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingHorizontal:24,backgroundColor:C.bg},
  statusText:{color:C.ink,fontWeight:'800',fontSize:12}, island:{width:96,height:22,backgroundColor:'#26352F',borderRadius:20},
  header:{ paddingHorizontal:23, paddingTop:13, paddingBottom:10, flexDirection:'row',justifyContent:'space-between',alignItems:'center',backgroundColor:C.bg },
  logo:{height:37,width:37,borderRadius:13,backgroundColor:'#EAF0DC',alignItems:'center',justifyContent:'center'},
  streak:{flexDirection:'row',alignItems:'center',gap:3,backgroundColor:C.yellow,borderRadius:20,paddingHorizontal:10,paddingVertical:8},
  avatar:{width:36,height:36,borderRadius:18,alignItems:'center',justifyContent:'center',backgroundColor:'#EAE4E0'},
  scrollContent:{paddingHorizontal:24,paddingTop:9,paddingBottom:26},
  button:{borderRadius:15,paddingHorizontal:18,paddingVertical:17,alignItems:'center',justifyContent:'center',minHeight:53},
  chip:{paddingVertical:10,paddingHorizontal:14,borderRadius:24,borderWidth:1,borderColor:'#E2E6DE',backgroundColor:'#FFF'},
  hero:{backgroundColor:C.green,borderRadius:24,padding:19,marginTop:23,marginBottom:19,minHeight:203,flexDirection:'row',overflow:'hidden'},
  heroButton:{backgroundColor:'#FFF',borderRadius:10,paddingHorizontal:13,paddingVertical:10,alignSelf:'flex-start',marginTop:15},
  heroArt:{position:'absolute',right:5,bottom:14,width:155,height:148,alignItems:'center',justifyContent:'center',transform:[{rotate:'-9deg'}]},
  summaryStats:{flexDirection:'row',backgroundColor:'#FFF',borderWidth:1,borderColor:C.line,borderRadius:19,alignItems:'center',paddingVertical:16,marginBottom:29},
  summaryNumber:{fontSize:22,color:C.ink,fontWeight:'900',marginBottom:3}, verticalDivider:{height:28,width:1,backgroundColor:C.line},
  featured:{backgroundColor:'#FFF',borderRadius:18,borderWidth:1,borderColor:C.line,padding:15,marginBottom:29},
  featureIcon:{width:60,height:60,borderRadius:15,alignItems:'center',justifyContent:'center'},
  courseMini:{width:176,minHeight:212,borderRadius:22,padding:17},miniEmoji:{alignItems:'center',justifyContent:'center',height:75},
  miniTitle:{fontWeight:'800',fontSize:17,lineHeight:21,marginTop:6},
  courseRow:{backgroundColor:'#FFF',borderWidth:1,borderColor:C.line,padding:13,borderRadius:17,marginBottom:11,flexDirection:'row',alignItems:'center',gap:12},
  courseRowIcon:{height:78,width:78,borderRadius:14,alignItems:'center',justifyContent:'center'},
  nav:{paddingTop:9,paddingBottom:Platform.OS==='ios'?12:8,backgroundColor:'#FFF',borderTopWidth:1,borderTopColor:C.line,flexDirection:'row'},
  navItem:{flex:1,alignItems:'center'},navGlyph:{height:31,width:42,borderRadius:11,alignItems:'center',justifyContent:'center'},
  homeIndicator:{height:18,backgroundColor:'#FFF',alignItems:'center',justifyContent:'center'},
  searchBox:{marginTop:19,marginBottom:15,borderRadius:16,backgroundColor:'#FFF',borderWidth:1,borderColor:C.line,paddingHorizontal:15,height:51,flexDirection:'row',alignItems:'center',gap:10},
  searchInput:{flex:1,height:'100%',color:C.ink,fontSize:13,outlineStyle: undefined},
  empty:{backgroundColor:'#FFF',borderWidth:1,borderColor:C.line,borderRadius:18,alignItems:'center',padding:23,marginTop:7,marginBottom:15},
  createFooter:{backgroundColor:C.softGreen,borderRadius:17,padding:14,flexDirection:'row',gap:12,alignItems:'center',marginTop:12},
  backBar:{paddingHorizontal:24,paddingTop:12,paddingBottom:12,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
  courseHero:{borderRadius:23,padding:23,minHeight:227,justifyContent:'flex-start',marginTop:7,overflow:'hidden'},
  courseMeta:{backgroundColor:'#FFF',borderWidth:1,borderColor:C.line,borderRadius:17,padding:14,flexDirection:'row',justifyContent:'space-around',alignItems:'center',marginTop:18,marginBottom:27},
  lessonRow:{backgroundColor:'#FFF',borderRadius:17,borderWidth:1,borderColor:C.line,padding:15,flexDirection:'row',gap:12,alignItems:'center',marginBottom:11},
  lessonNumber:{width:43,height:43,borderRadius:14,alignItems:'center',justifyContent:'center'},
  lessonContent:{marginTop:17,flex:1},
  lessonVisual:{height:208,borderRadius:24,alignItems:'center',justifyContent:'center',overflow:'hidden'},
  sparkOne:{position:'absolute',left:35,top:32}, sparkTwo:{position:'absolute',right:34,bottom:24},
  takeaway:{marginTop:23,backgroundColor:C.softGreen,borderRadius:16,padding:15,flexDirection:'row',gap:11},
  lessonActions:{marginTop:23,flexDirection:'row',gap:10},
  quizVisual:{height:112,width:112,borderRadius:28,alignItems:'center',justifyContent:'center'},
  option:{borderWidth:2,borderRadius:16,padding:12,minHeight:61,flexDirection:'row',alignItems:'center',gap:12},
  optionLetter:{width:33,height:33,borderRadius:11,alignItems:'center',justifyContent:'center'},
  feedback:{borderRadius:15,padding:13,flexDirection:'row',gap:10,marginTop:16},
  doneWrap:{flex:1,alignItems:'center',justifyContent:'center',paddingHorizontal:10,paddingBottom:20},
  doneArt:{backgroundColor:C.softGreen,width:175,height:175,borderRadius:87,alignItems:'center',justifyContent:'center'},
  xpAward:{backgroundColor:'#FFF',borderRadius:15,paddingVertical:12,paddingHorizontal:20,marginTop:27,flexDirection:'row',gap:10,alignItems:'center'},
  statsHero:{backgroundColor:C.green,borderRadius:20,padding:23,marginTop:23,marginBottom:14,minHeight:163},
  statTile:{flex:1,backgroundColor:'#FFF',borderWidth:1,borderColor:C.line,borderRadius:17,padding:18,minHeight:126},
  progressCard:{backgroundColor:'#FFF',borderRadius:17,borderWidth:1,borderColor:C.line,padding:17,marginBottom:25},
  profileCard:{backgroundColor:'#FFF',borderRadius:18,borderWidth:1,borderColor:C.line,padding:16,flexDirection:'row',alignItems:'center',gap:14,marginVertical:23},
  profileAvatar:{height:74,width:74,borderRadius:19,backgroundColor:C.yellow,alignItems:'center',justifyContent:'center'},
  infoCard:{backgroundColor:'#FFF',borderRadius:16,borderWidth:1,borderColor:C.line,padding:15,flexDirection:'row',gap:12,marginBottom:10},
  infoEmoji:{fontSize:26},infoTitle:{color:C.ink,fontSize:14,fontWeight:'800',marginBottom:4},
  createVisual:{height:122,borderRadius:22,flexDirection:'row',gap:15,alignItems:'center',justifyContent:'center'},
  formLabel:{fontSize:13,color:C.ink,fontWeight:'800',marginBottom:10},
  input:{backgroundColor:'#FFF',borderWidth:1,borderColor:C.line,borderRadius:13,paddingHorizontal:15,paddingVertical:15,fontSize:13,color:C.ink},
  errorPanel:{backgroundColor:'#FFF2EE',borderRadius:12,padding:12,marginTop:16,flexDirection:'row',gap:9},
  overlay:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(20,32,28,0.50)',alignItems:'center',justifyContent:'center',padding:24,zIndex:100},
  dialog:{width:'100%',maxWidth:330,backgroundColor:'#FFF',borderRadius:22,padding:24,alignItems:'center'},
});
