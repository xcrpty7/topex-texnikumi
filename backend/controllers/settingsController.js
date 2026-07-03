const SiteSettings = require('../models/SiteSettings');
const { sendSuccess, sendError } = require('../utils/response');

const ALLOWED_FIELDS = [
  'phone','phone2','email','address','workingHours','mapLink',
  'telegram','instagram','facebook','youtube',
  'heroLabel','heroTitle','heroSubtitle','heroBtn','heroBtn2','heroNote','heroImage','footerDescription','heroBgImage',
  'siteTitle','siteDescription',
  'brandSuffix','brandTagline','logo',
  'footerPagesTitle','footerHoursTitle','footerLegalTitle','footerContactsTitle',
  'footerLegal1Label','footerLegal1Url','footerLegal2Label','footerLegal2Url',
  'footerCopyright','footerBottomRight',
  'coursesHeroBadge','coursesFacultyLabel','coursesFacultyTitle','coursesFacultySubtitle',
  'coursesCtaLabel','coursesCtaPhoneBtn','coursesCtaHomeBtn',
  'blogHeroBadge',
  'galleryHeroBadge','galleryPhotosLabel','galleryPhotosTitle','galleryStudentsTab','galleryTeachersTab',
  'aboutLabel','videoLabel','videoTitle','popularLabel','popularTitle','popularSubtitle','popularBtn',
  'featuresLabel','featuresTitle','featuresSubtitle',
  'grantsLabel','grantsTitle','grantsSubtitle',
  'faqLabel','faqTitle',
  'applicationBadge','applicationTitle','applicationSubtitle',
  'applicationFormTitle','applicationFormSubtitle','applicationSubmitBtn',
  'aboutTitle','aboutText','aboutImage',
  'statsStudents','statsBranches','statsTeachers','statsGrades',
  'subjects','extras','features','scholarshipCards',
  'coursesHeroTitle','coursesHeroSubtitle','coursesHeroImage','coursesHighlights',
  'coursesCtaTitle','coursesCtaSubtitle','coursesCtaPhone',
  'diplomaTitle','diplomaText','diplomaImage1','diplomaImage2',
  'diplomaCard1Title','diplomaCard1Desc','diplomaCard2Title','diplomaCard2Desc',
  'employmentTitle','employmentText','employmentBullets','employmentFooter','employmentImage',
  'galleryHeroTitle','galleryHeroSubtitle','galleryHeroImage',
  'blogHeroTitle','blogHeroSubtitle','blogHeroImage',
  'contactHeroTitle','contactHeroSubtitle','contactHeroImage',
  'contactCard1Title','contactCard2Title','contactCard3Title','contactCard4Title','contactMapTitle',
  'heroSlides','heroCtaText','heroNoteText',
  'aboutSectionLabel','aboutSectionTitle','aboutSlogan','aboutParagraph','aboutBtnText',
  'aboutStat1Value','aboutStat1Label','aboutStat2Value','aboutStat2Label',
  'aboutImage1','aboutImage2','aboutImage3','aboutImage4',
  'directionsLabel','directionsTitle',
  'teamLabel','teamTitle','teamParagraph','teamBtnText',
  'newsLabel','newsTitle','newsMoreText',
  'videosLabel','videosTitle','videosSubtitle',
  'formLabel','formTitle','formParagraph',
  'formNameLabel','formNamePh','formPhoneLabel','formDirLabel','formDirPh','formDir9','formDir11',
  'formAgreeText','formSubmitText','formImage',
  'footerColAboutTitle','footerColApplicantsTitle','footerColStudentsTitle','footerColContactsTitle',
  'footerCopyText','footerOfertaText','footerLicenseText','footerLicenseImage','address2',
  'footerColAboutLinks','footerColApplicantsLinks','footerColStudentsLinks',
];

const ARRAY_FIELDS = ['subjects','extras','features','scholarshipCards','coursesHighlights','employmentBullets'];

const getSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) settings = await SiteSettings.create({});
    // formImage null/bo'sh bo'lsa startsWith TypeError bermasligi uchun tip tekshiruvi
    if (typeof settings.formImage === 'string' &&
        (settings.formImage === '/assets/images/DSC00912.jpg' || settings.formImage.startsWith('/uploads/'))) {
      settings.formImage = '/assets/images/form-photo.jpg';
      await settings.save();
    }
    return sendSuccess(res, { data: settings });
  } catch (e) {
    return sendError(res, e.message, 500);
    }
};

const updateSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) settings = new SiteSettings();

    for (const key of ALLOWED_FIELDS) {
      if (req.body[key] !== undefined) {
        settings[key] = req.body[key];
      }
    }

    for (const f of ARRAY_FIELDS) {
      if (req.body[f] !== undefined) settings.markModified(f);
    }

    await settings.save();
    return sendSuccess(res, { data: settings }, 'Sayt sozlamalari saqlandi');
  } catch (e) {
    return sendError(res, e.message, 500);
    }
};

const uploadSettingsImage = async (req, res) => {
  try {
    if (!req.file) return sendError(res, 'Rasm yuklanmadi', 400);
    const url = `/uploads/gallery/${req.file.filename}`;
    return sendSuccess(res, { data: { url } }, 'Rasm yuklandi');
  } catch (e) {
    return sendError(res, e.message, 500);
    }
};

module.exports = { getSettings, updateSettings, uploadSettingsImage };