import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Row, Carousel, Typography, List, Empty, Button } from 'antd'
import { ColStyled, CardStyled } from './style'
import { SculptureCardDescription } from './SculptureGrid'
import api from '../../api'
import Loading from '../Loading'
import Error from 'next/error'
import MyStaticMap from '../map-components/StaticMap'
import Link from 'next/link'

const { Text, Title, Paragraph } = Typography

const SculptureDetail = () => {
  const [sculpture, setSculpture] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSculpture = async () => {
      try {
        const data = (await api.get(`/sculpture/${id}`)).data
        console.log(data)
        setSculpture(data)
      } catch (e) {
        const { statusCode, message } = e.response.data
        setError({
          statusCode,
          message
        })
      }
      setLoading(false)
    }
    fetchSculpture()
  }, [id])

  const router = useRouter()
  const id = router.query.id

  if (loading) return <Loading />
  if (error)
    return <Error statusCode={error.statusCode} title={error.message} />

  const {
    images,
    name,
    primaryMaker,
    accessionId,
    longitude,
    latitude,
    productionDate,
    material,
    creditLine,
    locationNotes
  } = sculpture

  const { birthYear, deathYear, nationality, wikiUrl } = primaryMaker

  const markerLat = Number(latitude)
  const markerLng = Number(longitude)

  const imageList = images.map((image, idx) => (
    <div key={idx}>
      <img src={image.url} />
    </div>
  ))

  return (
    <Row gutter={16}>
      <ColStyled xs={24} lg={15}>
        <CardStyled
          title="Sculpture Details"
          extra={
            <Link href={`/sculptures/id/${id}/edit`}>
              <a>
                <Button icon="edit">Edit details</Button>
              </a>
            </Link>
          }
        >
          <Carousel
            draggable
            style={{
              width: '100%'
            }}
          >
            {images.length ? (
              imageList
            ) : (
              <div>
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  style={{ height: 100, marginTop: 100 }}
                />
              </div>
            )}
          </Carousel>
          <div
            style={{
              marginTop: 15
            }}
          >
            <Title level={4} style={{ marginBottom: 0 }}>
              {name}
            </Title>
            <SculptureCardDescription
              makerName={primaryMaker.firstName + ' ' + primaryMaker.lastName}
            />

            <List itemLayout="horizontal">
              <List.Item>
                <List.Item.Meta
                  title="Accession ID"
                  description={
                    !accessionId.includes('unknown') ? accessionId : 'N/A'
                  }
                />
              </List.Item>
              <List.Item>
                <List.Item.Meta
                  title="Production Date"
                  description={productionDate ? productionDate : 'N/A'}
                />
              </List.Item>
              <List.Item>
                <List.Item.Meta
                  title="Material"
                  description={material ? material : 'N/A'}
                />
              </List.Item>
              <List.Item>
                <List.Item.Meta
                  title="Credit Line"
                  description={
                    creditLine
                      ? creditLine
                          .trim()
                          .split('\n')
                          .map((line, idx) => <div key={idx}>{line}</div>)
                      : 'N/A'
                  }
                />
              </List.Item>
              <List.Item>
                <List.Item.Meta
                  title="Location Details"
                  description={
                    locationNotes
                      ? locationNotes
                          .trim()
                          .split('\n')
                          .map((line, idx) => <div key={idx}>{line}</div>)
                      : 'N/A'
                  }
                />
              </List.Item>
            </List>
          </div>
        </CardStyled>
      </ColStyled>
      {/* Maker detail */}
      <ColStyled xs={24} lg={9}>
        <MyStaticMap markerLat={markerLat} markerLng={markerLng} />
        <CardStyled title="Primary maker details" style={{ marginTop: 10 }}>
          <List
            itemLayout="horizontal"
            style={{
              marginTop: -20
            }}
          >
            <List.Item>
              <List.Item.Meta
                title="Full Name"
                description={
                  primaryMaker.firstName + ' ' + primaryMaker.lastName
                }
              />
            </List.Item>
            <List.Item>
              <List.Item.Meta
                title="Nationality"
                description={nationality ? nationality : 'N/A'}
              />
            </List.Item>
            <List.Item>
              <List.Item.Meta
                title="Birth year"
                description={birthYear ? birthYear : 'N/A'}
              />
            </List.Item>
            <List.Item>
              <List.Item.Meta
                title="Death year"
                description={deathYear ? deathYear : 'N/A'}
              />
            </List.Item>
            <List.Item>
              <List.Item.Meta
                title="URL"
                description={
                  wikiUrl ? <a href={`${wikiUrl}`}>{wikiUrl}</a> : 'N/A'
                }
              />
            </List.Item>
          </List>
        </CardStyled>
      </ColStyled>
    </Row>
  )
}

export default SculptureDetail
