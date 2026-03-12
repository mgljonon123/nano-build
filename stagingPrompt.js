export function buildStagingPrompt(input) {
  const formulaireGlobal = JSON.stringify(input).toUpperCase()
  let actionChoisie = 'AMÉNAGER'
  let actionSortieEN = 'FURNISH'

  if (formulaireGlobal.includes('EMPTY') || formulaireGlobal.includes('VIDER')) {
    actionChoisie = 'VIDER'
    actionSortieEN = 'EMPTY'
  } else if (formulaireGlobal.includes('CLEAN') || formulaireGlobal.includes('NETTOYER')) {
    actionChoisie = 'NETTOYER'
    actionSortieEN = 'CLEAN'
  }

  const styleBrut = (
    input.style ||
    input['Which style / brand do you want?'] ||
    input['Quel style / marque souhaitez-vous ?'] ||
    'MODERN'
  )
    .toString()
    .toUpperCase()

  let styleChoisi = styleBrut.replace(/\s*\(.*?\)/g, '').trim()

  if (styleChoisi === 'ART DÉCO' || styleChoisi === 'ART DECO') styleChoisi = 'ART DÉCO'
  if (styleChoisi === 'MODERN') styleChoisi = 'MODERNE'
  if (styleChoisi === 'MODERN LUXURY') styleChoisi = 'MODERNE LUXE'
  if (styleChoisi === 'ULTRA LUXURY') styleChoisi = 'ULTRA LUXE'
  if (styleChoisi === 'SCANDINAVIAN') styleChoisi = 'SCANDINAVE'
  if (styleChoisi === 'INDUSTRIAL') styleChoisi = 'INDUSTRIEL'

  const formValues = Object.values(input).map((v) => String(v).toUpperCase().trim())
  const reponsesSansStyle = formValues.filter((val) => val !== styleBrut.trim()).join(' ')

  let pieceIdentifieeFR = 'SALON'
  let pieceIdentifieeEN = 'LIVING ROOM'

  if (reponsesSansStyle.includes('KITCHEN') || reponsesSansStyle.includes('CUISINE')) {
    pieceIdentifieeFR = 'CUISINE'
    pieceIdentifieeEN = 'KITCHEN'
  } else if (reponsesSansStyle.includes('KIDS') || reponsesSansStyle.includes('ENFANT')) {
    pieceIdentifieeFR = "CHAMBRE D'ENFANT"
    pieceIdentifieeEN = 'KIDS ROOM'
  } else if (reponsesSansStyle.includes('BEDROOM') || reponsesSansStyle.includes('CHAMBRE')) {
    pieceIdentifieeFR = 'CHAMBRE'
    pieceIdentifieeEN = 'BEDROOM'
  } else if (reponsesSansStyle.includes('BALCONY') || reponsesSansStyle.includes('BALCON')) {
    pieceIdentifieeFR = 'BALCON'
    pieceIdentifieeEN = 'BALCONY'
  } else if (reponsesSansStyle.includes('OFFICE') || reponsesSansStyle.includes('BUREAU')) {
    pieceIdentifieeFR = 'BUREAU'
    pieceIdentifieeEN = 'OFFICE'
  } else if (reponsesSansStyle.includes('BATH') || reponsesSansStyle.includes('BAIN')) {
    pieceIdentifieeFR = 'SALLE DE BAIN'
    pieceIdentifieeEN = 'BATHROOM'
  }

  const marquesCuisine = ['BULTHAUP', 'BOFFI', 'POLIFORM', 'ARTHUR BONNET']
  const marquesAutres = [
    'VITRA',
    'BOCONCEPT',
    'ROCHE BOBOIS',
    'MINOTTI / B&B ITALIA',
    'KNOLL / CASSINA',
    'HERMAN MILLER',
  ]

  if (pieceIdentifieeFR !== 'CUISINE' && marquesCuisine.includes(styleChoisi)) {
    styleChoisi = 'MODERNE LUXE'
  }
  if (pieceIdentifieeFR === 'CUISINE' && marquesAutres.includes(styleChoisi)) {
    styleChoisi = 'ULTRA LUXE'
  }

  const dictionnaireStyles = {
    MODERNE: 'Revêtements lisses, couleurs neutres, verre et métal, ambiance lumineuse.',
    'MODERNE LUXE':
      'Matériaux nobles, finitions épurées, touches de laiton, mobilier design contemporain.',
    'ULTRA LUXE':
      'Marbre omniprésent, métaux précieux, velours, bois exotique, éclairage architectural dramatique.',
    SCANDINAVE: 'Bois clair dominant, pastels mats, textiles douillets, ambiance hygge.',
    INDUSTRIEL: 'Aspect brique/béton, métal noir, bois brut, tons terreux.',
    'WABI-SABI':
      'Minimalisme brut et élégant. Murs texturés, bois naturel et vieilli, textiles en lin.',
    'MID-CENTURY MODERN':
      'Design années 50/60. Bois de noyer chaleureux, meubles sur pieds en compas.',
    'PARISIAN CHIC / HAUSSMANNIEN':
      'Contraste élégant. Architecture classique lumineuse associée à un mobilier design ultra-contemporain.',
    'ART DÉCO':
      'Atmosphère Gatsby. Motifs géométriques, velours profonds, touches de laiton/or, marbre.',
    VITRA: 'Mobilier design iconique (Eames, Prouvé), touches de couleurs subtiles, esprit loft berlinois.',
    BOCONCEPT:
      'Design danois urbain, lignes épurées et fonctionnelles, tons neutres et élégants.',
    'ROCHE BOBOIS': 'Luxe à la française, mobilier audacieux et créatif, textures riches.',
    'MINOTTI / B&B ITALIA':
      'Design italien ultra-luxe. Immenses canapés bas aux tissus riches, tables en marbre monolithique.',
    'KNOLL / CASSINA':
      'Design pointu et historique. Mobilier structuré associant cuir noir et tubes d\'acier chromé.',
    'HERMAN MILLER': 'Mobilier de bureau iconique haut de gamme. Chaises ergonomiques design.',
    BULTHAUP: 'Cuisine de luxe allemande, minimalisme absolu, fonctionnalité parfaite.',
    BOFFI: 'Cuisine italienne ultra-luxe, design sophistiqué, matériaux exclusifs.',
    POLIFORM:
      'Cuisine et rangements ultra-luxe italiens. Lignes architecturales parfaites, façades lisses.',
    'ARTHUR BONNET': 'Élégance à la française, laque mate, bois chaleureux, finitions soignées.',
  }

  const descriptionStyle = dictionnaireStyles[styleChoisi] || styleChoisi
  const ancrageStylePiece = ` [ADAPTATION DU STYLE REQUISE] : Tu dois impérativement adapter les codes et les matériaux du style ${styleChoisi} pour qu'ils correspondent spécifiquement à un(e) ${pieceIdentifieeFR}.`

  const reglesBases =
    "[RÈGLES ARCHITECTURALES STRICTES - TOLÉRANCE ZÉRO] : 1. Conserve absolument l'architecture fixe originale de la photo fournie (murs, sol, plafond, fenêtres, portes, radiateurs, prises, carrelage, boiseries). Ne change rien à la structure technique. 2. MAINTIENS L'ANGLE DE VUE ET LA PERSPECTIVE D'ORIGINE. L'appareil photo ne doit pas bouger d'un millimètre. Ne change pas les points de fuite exacts. 3. Respecte parfaitement les proportions originales de la pièce. Aucun étirement, recadrage (cropping) ou distorsion. Considère que l'objectif est fixe. 4. Luminosité naturelle, rendu photoréaliste professionnel. "
  const regleEclairage =
    " ÉCLAIRAGE (TRÈS IMPORTANT) : Respecte strictement les installations électriques existantes. S'il y a une ampoule dénudée ou un fil suspendu visible au plafond sur la photo d'origine, habille-le avec un beau luminaire (suspension ou lustre). S'il n'y a AUCUNE sortie électrique au plafond, n'invente surtout pas de suspension ou de lustre pour ne pas fausser le bien immobilier."

  let finalPrompt = ''

  if (actionChoisie === 'VIDER') {
    finalPrompt =
      reglesBases +
      'ACTION REQUISE : Supprime absolument TOUS les meubles, objets et décorations présents pour rendre cette pièce entièrement vide. Ne conserve que l\'architecture nue. Aucune décoration ni meuble ne doit rester visible.'
  } else if (actionChoisie === 'NETTOYER') {
    finalPrompt =
      reglesBases +
      "ACTION REQUISE : Nettoie virtuellement cette pièce. Supprime le désordre, les objets encombrants, la saleté, les cartons ou les traces de travaux. Conserve les équipements principaux (sanitaires si salle de bain, cuisine si cuisine) mais rends l'espace impeccable, lumineux, aéré et prêt pour une visite immobilière. Ne modifie pas le style ou la fonction de la pièce."
  } else {
    const contraintesAmenagement =
      reglesBases +
      '4. CIRCULATION ET ACCÈS (CRUCIAL) : Ne bloque JAMAIS les portes, les ouvertures ou les couloirs avec des meubles. L\'accès aux portes doit rester 100% libre et dégagé. 5. Aspect habité. 6. AMBIANCE BERLINOISE : L\'atmosphère globale doit refléter le style de vie berlinois chic (charme de l\'Altbau, lumière, modernité décontractée, élégance urbaine). '

    let specificPrompt = ''

    if (pieceIdentifieeFR === 'SALON') {
      specificPrompt =
        `FONCTION : SALON. STYLE : ${styleChoisi} (${descriptionStyle}).${ancrageStylePiece} ` +
        'AMÉNAGEMENT : Grand canapé, coussins élégants. Zone repas avec table dressée. ' +
        'DÉCORATION : Tapis épais, cadres Yellow Korner style, plaid froissé, tasse de café posée.' +
        regleEclairage
    } else if (pieceIdentifieeFR === 'CUISINE') {
      specificPrompt =
        `FONCTION : CUISINE ÉQUIPÉE. STYLE : ${styleChoisi} (${descriptionStyle}).${ancrageStylePiece} ` +
        'CONTRAINTE : Respecter les raccordements. AMÉNAGEMENT : Four encastré, réfrigérateur, évier design. ' +
        'DÉCORATION : Corbeille de fruits, planche à découper. ÉCLAIRAGE : Bandeaux LED sous les meubles hauts.' +
        regleEclairage
    } else if (pieceIdentifieeFR === 'CHAMBRE') {
      specificPrompt =
        `FONCTION : CHAMBRE. STYLE : ${styleChoisi} (${descriptionStyle}).${ancrageStylePiece} ` +
        'AMÉNAGEMENT : Lit double généreux, tapis, armoire, chevets. ' +
        'DÉCORATION : Plaid au bout du lit, livre, art mural.' +
        regleEclairage
    } else if (pieceIdentifieeFR === "CHAMBRE D'ENFANT") {
      specificPrompt =
        `FONCTION : CHAMBRE D'ENFANT. STYLE : ${styleChoisi} (${descriptionStyle}).${ancrageStylePiece} ` +
        'AMÉNAGEMENT : Lit d\'enfant, petit bureau, rangements pour jouets. ' +
        'DÉCORATION : Tapis de jeu, quelques beaux jouets en bois rangés, peluche sur le lit. ' +
        "Atmosphère douce, lumineuse et ordonnée." +
        regleEclairage
    } else if (pieceIdentifieeFR === 'BALCON') {
      specificPrompt =
        `FONCTION : BALCON. STYLE : ${styleChoisi} (${descriptionStyle}).${ancrageStylePiece} ` +
        "AMÉNAGEMENT : Sièges extérieurs, table basse dressée. DÉCORATION : Tapis d'extérieur, plantes. " +
        'CONTRAINTE : Laisser l\'entrée fluide.'
    } else if (pieceIdentifieeFR === 'BUREAU') {
      specificPrompt =
        `FONCTION : BUREAU À DOMICILE. STYLE : ${styleChoisi} (${descriptionStyle}).${ancrageStylePiece} ` +
        'AMÉNAGEMENT : Bureau, chaise ergonomique, étagères. ' +
        'DÉCORATION : Ordinateur, carnet, stylos, tasse, plantes.' +
        regleEclairage
    } else if (pieceIdentifieeFR === 'SALLE DE BAIN') {
      specificPrompt =
        `FONCTION : SALLE DE BAIN. STYLE : ${styleChoisi} (${descriptionStyle}).${ancrageStylePiece} ` +
        'AMÉNAGEMENT : Conserver les sanitaires existants. ' +
        "Ajouter du linge de bain élégant, des distributeurs de savon design, une petite plante si l'espace le permet." +
        regleEclairage
    } else {
      specificPrompt =
        `FONCTION : ${pieceIdentifieeFR}. STYLE : ${styleChoisi} (${descriptionStyle}).${ancrageStylePiece} ` +
        'AMÉNAGEMENT : Mobilier adapté. Aspect habité.' +
        regleEclairage
    }

    finalPrompt = contraintesAmenagement + specificPrompt
  }

  return {
    finalPrompt,
    roomType: pieceIdentifieeEN,
    action: actionSortieEN,
    styleDetecte: styleChoisi,
  }
}
